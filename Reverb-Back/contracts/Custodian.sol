// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import "hardhat/console.sol";
import "./ICustodian.sol";
import "./ILPToken.sol";
import "./IRepaymentPool.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./aave/ILendingPoolAddressesProvider.sol";
import "./aave/ILendingPool.sol";

contract Custodian is Ownable, ICustodian {
    using SafeERC20 for IERC20;
    using SafeERC20 for ILPToken;

    ILPToken public immutable lpToken;
    IRepaymentPool public repaymentPool;
    IERC20 constant usdc = IERC20(0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e);
    IERC20 constant aUsdc = IERC20(0x2271e3Fef9e15046d09E1d78a8FF038c691E9Cf9);
    ILendingPoolAddressesProvider constant aaveAddresses =
        ILendingPoolAddressesProvider(
            0x178113104fEcbcD7fF8669a0150721e231F0FD4B
        );
    ILendingPool public immutable aavePool;

    uint256 private reserveBalance; // USDC balance held by this contract (reserve liquidity)
    uint256 private defiBalance; // aUSDC balance held in Aave
    uint256 public investedBalance; // balance invested in real-life contracts
    uint256 constant tolerance = 50; // pool balancing tolerance, in 1/1000th
    uint256 constant baseReserveShare = 200; // portion of liquidity to keep as reserve, in 1/1000th

    constructor(ILPToken _lpToken) {
        lpToken = _lpToken;
        aavePool = ILendingPool(aaveAddresses.getLendingPool());
    }

    function setRepaymentPool(IRepaymentPool _repaymentPool)
        external
        onlyOwner
    {
        repaymentPool = _repaymentPool;
    }

    function withdraw(uint256 amount) external override onlyOwner {
        require(
            getAvailableBalance() >= amount,
            "Withdrawal amount exceeds available balance"
        );

        uint256 reserve = usdc.balanceOf(address(this));
        if (reserve < amount) {
            uint256 excessBalance = amount - reserve;
            withdrawAave(excessBalance);
        }
        usdc.safeTransfer(_msgSender(), amount);
        investedBalance += amount;
        //rebalancePools();

        emit WithdrawalToSafe(amount);
    }

    function deposit(uint256 amount, address onBehalfOf) external override {
        require(amount > 0, "Cannot deposit 0 USDC");

        uint256 lpAmountToMint = calculateUsdcToLp(amount);
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        reserveBalance += amount;

        lpToken.mint(onBehalfOf, lpAmountToMint);
        // rebalancePools();
    }

    function redeem(uint256 lpAmount) external override {
        uint256 shareInUsdc = calculateLpToUsdc(lpAmount);
        reserveBalance = usdc.balanceOf(address(this));
        lpToken.burnFrom(msg.sender, lpAmount);

        if (shareInUsdc > reserveBalance) {
            require(
                shareInUsdc <= reserveBalance + aUsdc.balanceOf(address(this)),
                "Insufficient funds in reserve pool"
            );
            uint256 excessShare = shareInUsdc - reserveBalance;
            withdrawAave(excessShare);
        }
        // optimizable so that rebalancePool is not needed
        usdc.safeTransfer(msg.sender, shareInUsdc);
        reserveBalance = usdc.balanceOf(address(this));

        emit LpRedeemed(lpAmount, shareInUsdc);

        // rebalancePools();
    }

    function repayPrincipal(uint256 amount) external {
        require(
            msg.sender == address(repaymentPool),
            "Only repayment pool can repay principal"
        );
        // protecting against investedBalance underflow
        investedBalance > amount
            ? investedBalance -= amount
            : investedBalance = 0;
    }

    function rebalancePools() internal {
        uint256 availableBalance = getAvailableBalance();
        if (availableBalance > 0) {
            reserveBalance = usdc.balanceOf(address(this));
            uint256 currentReserveShare = (reserveBalance * 1000) /
                availableBalance;

            if (currentReserveShare > baseReserveShare + tolerance) {
                console.log("Reserve too large");
                uint256 excessReserve = reserveBalance -
                    (baseReserveShare * availableBalance) /
                    1000;
                depositAave(excessReserve);
            } else if (currentReserveShare < baseReserveShare - tolerance) {
                console.log("Reserve too small");
                uint256 deficitReserve = (baseReserveShare * availableBalance) /
                    1000 -
                    reserveBalance;
                withdrawAave(deficitReserve);
            }
        }
        defiBalance = aUsdc.balanceOf(address(this));
        reserveBalance = usdc.balanceOf(address(this));
    }

    function depositAave(uint256 amount) internal {
        require(
            usdc.balanceOf(address(this)) >= amount,
            "Amount exceeds USDC balance"
        );

        usdc.safeIncreaseAllowance(address(aavePool), amount);

        uint256 originalBalance = aUsdc.balanceOf(address(this));
        aavePool.deposit(address(usdc), amount, address(this), 0);
        console.log(
            "Approval amount after deposit:",
            usdc.allowance(address(this), address(aavePool))
        );

        assert(aUsdc.balanceOf(address(this)) - originalBalance == amount);
    }

    function withdrawAave(uint256 amount) internal {
        require(
            aUsdc.balanceOf(address(this)) >= amount,
            "Amount exceeds aUSDC balance"
        );

        aUsdc.safeIncreaseAllowance(address(aavePool), amount);
        aavePool.withdraw(address(usdc), amount, address(this));

        console.log(
            "Approval amount after withdrawal:",
            usdc.allowance(address(this), address(aavePool))
        );
    }

    function calculateUsdcToLp(uint256 usdcAmount)
        public
        view
        override
        returns (uint256)
    {
        uint256 totalLpSupply = lpToken.totalSupply();
        if (totalLpSupply == 0) {
            return usdcAmount;
        }

        uint256 totalBalance = getTotalBalance();

        // console.log("Total balance:", totalBalance); //
        // console.log("Total LP supply:", totalLpSupply); //

        uint256 shareOfNewBalance = (usdcAmount * 10**6) /
            (totalBalance + usdcAmount);

        // console.log("Share of new balance: ", shareOfNewBalance);
        // console.log(
        //     "New calculated LP amount:",
        //     (shareOfNewBalance * totalLpSupply) / (10**6 - shareOfNewBalance)
        // );

        return
            (shareOfNewBalance * totalLpSupply) / (10**6 - shareOfNewBalance); // add multiplier
    }

    function calculateLpToUsdc(uint256 lpAmount)
        public
        view
        override
        returns (uint256)
    {
        uint256 totalBalance = getTotalBalance();
        uint256 totalLpSupply = lpToken.totalSupply();

        // we calculate the share of the pool that this LP amount entitles the user to (with 10**18 multiplier)
        uint256 lpShare = totalLpSupply == 0
            ? 0
            : (lpAmount * 10**18) / totalLpSupply;

        return (totalBalance * lpShare) / (10**18);
    }

    function getTotalBalance() public view override returns (uint256) {
        uint256 aUsdcBalance = aUsdc.balanceOf(address(this));
        uint256 usdcBalance = usdc.balanceOf(address(this));

        return usdcBalance + aUsdcBalance + investedBalance;
    }

    function getAvailableBalance() public view override returns (uint256) {
        uint256 aUsdcBalance = aUsdc.balanceOf(address(this));
        uint256 usdcBalance = usdc.balanceOf(address(this));

        return aUsdcBalance + usdcBalance;
    }

    function getPoolData(address user)
        external
        view
        override
        returns (
            address,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        address poolAddress = address(this);
        uint256 totalBalance = getTotalBalance();
        uint256 unallocatedBalance = getAvailableBalance();
        uint256 dealBalance = investedBalance;

        uint256 userLpBalance = lpToken.balanceOf(user);
        uint256 userUsdcBalance = calculateLpToUsdc(userLpBalance);
        uint256 totalLpBalance = lpToken.totalSupply();

        return (
            poolAddress,
            totalBalance,
            unallocatedBalance,
            dealBalance,
            totalLpBalance,
            userLpBalance,
            userUsdcBalance
        );
    }
}

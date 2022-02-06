// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICustodian {
    event WithdrawalToSafe(uint256 amount);
    event Deposit(uint256 amount);
    event LpRedeemed(uint256 lpAmount, uint256 usdcAmount);

    function deposit(uint256 amount, address onBehalfOf) external;

    function redeem(uint256 lpAmount) external;

    function withdraw(uint256 amount) external;

    function getPoolData(address user)
        external
        view
        returns (
            address,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        );

    function getAvailableBalance() external view returns (uint256);

    function getTotalBalance() external view returns (uint256);

    function calculateLpToUsdc(uint256 lpAmount)
        external
        view
        returns (uint256);

    function calculateUsdcToLp(uint256 usdcAmount)
        external
        view
        returns (uint256);
}

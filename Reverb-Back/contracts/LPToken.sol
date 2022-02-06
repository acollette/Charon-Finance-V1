// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./curve/ICurveFi_DepositY.sol";
import "./curve/ICurveFi_Gauge.sol";
import "./aave/ILendingPoolAddressesProvider.sol";
import "./aave/ILendingPool.sol";

contract LPToken is ERC20Burnable, Ownable {
    using SafeERC20 for IERC20;

    constructor() ERC20("Nooni Token", "NNT") {}

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }
}

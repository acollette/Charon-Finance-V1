// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

interface ICurveFi_DepositY {
    function add_liquidity(
        uint256[3] calldata uamounts,
        uint256 min_mint_amount
    ) external;

    function remove_liquidity(uint256 _amount, uint256[3] calldata min_uamounts)
        external;

    function remove_liquidity_imbalance(
        uint256[3] calldata uamounts,
        uint256 max_burn_amount
    ) external;

    function calc_token_amount(uint256[3] calldata, bool)
        external
        view
        returns (uint256);

    function coins(int128 i) external view returns (address);

    function underlying_coins(int128 i) external view returns (address);

    function underlying_coins() external view returns (address[4] memory);

    function curve() external view returns (address);

    function token() external view returns (address);
}

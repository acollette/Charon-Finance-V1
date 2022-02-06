// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import "hardhat/console.sol";
import "./ICustodian.sol";
import "./IRepaymentPool.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract RepaymentPool is IRepaymentPool, Ownable {
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;

    IERC20 constant usdc = IERC20(0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e);
    IRepaymentPool immutable repaymentPool;

    struct Deal {
        uint256 amountPaid; // amount paid so far
        uint256 totalAmount; // total amount (principal + interest)
        uint256 startTime;
        uint256 endTime;
        uint256 dealId;
        uint16 installments; // number of payment installments
        uint16 interestRate; // in 10's of a percent
        string description; // short description, e.g. company name
    }

    Counters.Counter lastDealId;
    mapping(uint256 => Deal) public dealList;

    constructor(IRepaymentPool _repaymentPool) {
        repaymentPool = _repaymentPool;
    }

    function repay(
        uint256 dealId,
        uint256 amount,
        uint256 interest
    ) external override {
        require(dealList[dealId].dealId == dealId, "Invalid deal ID");
        require(
            dealList[dealId].amountPaid < dealList[dealId].totalAmount,
            "Contract has been fully repaid"
        );

        usdc.transferFrom(msg.sender, owner(), amount + interest);
        dealList[dealId].amountPaid += amount + interest;

        emit Repayment(dealId, amount, interest);
    }

    function createDeal(
        uint256 totalAmount,
        uint256 startTime,
        uint256 endTime,
        uint16 installments,
        uint16 interestRate,
        string memory description
    ) external override onlyOwner {
        lastDealId.increment();
        uint256 currentId = lastDealId.current();

        dealList[currentId] = Deal({
            amountPaid: 0,
            totalAmount: totalAmount,
            startTime: startTime,
            endTime: endTime,
            installments: installments,
            interestRate: interestRate,
            dealId: currentId,
            description: description
        });

        emit DealCreated(currentId);
    }

    function getOpenDeals() external view returns (Deal[] memory) {
        uint256 activeDealNumber;
        for (uint256 i = 0; i < lastDealId.current(); i++) {
            if (dealList[i].amountPaid < dealList[i].totalAmount) {
                activeDealNumber++;
            }
        }

        Deal[] memory activeDeals = new Deal[](activeDealNumber);
        uint256 index;
        for (uint256 i = 0; i < lastDealId.current(); i++) {
            if (dealList[i].amountPaid < dealList[i].totalAmount) {
                activeDeals[index] = dealList[i];
                index++;
            }
        }

        return activeDeals;
    }

    function getLastDealId() external view returns (uint256) {
        return lastDealId.current();
    }
}

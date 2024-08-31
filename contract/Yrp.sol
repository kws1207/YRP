// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Ownable.sol";
import "./DemoHelper.sol";
import "./Datastructure.sol";

contract Yrp is Ownable {

    mapping(int => DataStructs.Bet[]) public bets;
    mapping(int => int) public xrpPriceIndices;
    mapping(address => int[]) public betEpochs;

    uint256 public baseBetValue = 0.05 ether;
    uint256 public scalingFactor = baseBetValue / 10;
    int public currentEpoch = 9; // TODO: Replace to actual epoch based on block timestamp
    uint feeConst = 5;

    uint public withdrawableAmount = 0;

    constructor() Ownable(msg.sender) payable {
        require(msg.value >= 30, "Not enough volume");
        DemoHelper.setXrpPriceIndices(xrpPriceIndices); // TODO: Replace with an oracle or other method to fetch actual XRP prices  
        DemoHelper.setInitialBettings(bets);
    }

    function bet(int priceRangeIndex, int betEpoch, int betAmount) external payable {
        require(betEpoch > currentEpoch, "Bet epoch must be greater than current epoch");
        require(betEpoch < currentEpoch + 2); // TODO: Extend b-able epoch range

        int requiredValue = (int(baseBetValue) + ((currentEpoch + 1 - betEpoch) * int(scalingFactor))) * int(betAmount); // TODO: Consider exponential decay
        require(msg.value == uint(requiredValue), "Incorrect betting amount.");

        withdrawableAmount += msg.value * feeConst / 1000;
        
        betEpochs[msg.sender].push(betEpoch);
        bets[betEpoch].push(DataStructs.Bet({
            bettor: msg.sender,
            priceRangeIndex: priceRangeIndex,
            value: msg.value * (1000 - feeConst) / 1000,
            amount: betAmount,
            claimed: false
        }));
    }

    function claim() external {
        uint256 payoutAmount = 0;

        for (uint i = 0; i < betEpochs[msg.sender].length; i++) {
            uint256 totalVolumeForEpoch = 0;
            int epoch = betEpochs[msg.sender][i]; // TODO: Check if currentEpoch is completed
            int actualPriceIndex = xrpPriceIndices[epoch];
            int validTotalAmount = 0;
            int validUserAmount = 0;

            for (uint j = 0; j < bets[epoch].length; j++) {
                DataStructs.Bet memory b = bets[epoch][j];
                if (actualPriceIndex == b.priceRangeIndex) {
                    validTotalAmount += b.amount;
                    if (b.bettor == msg.sender && b.claimed == false) {
                        validUserAmount += b.amount;
                        bets[epoch][j].claimed = true;
                    }
                }
            }

            for (uint j = 0; j < bets[epoch].length; j++) {
                totalVolumeForEpoch += bets[epoch][j].value;
            }
            
            payoutAmount += totalVolumeForEpoch * uint(validUserAmount) / uint(validTotalAmount);
        }

        require(payoutAmount <= address(this).balance, "Insufficient funds in contract");
        payable(msg.sender).transfer(payoutAmount);
    }

    function withdraw() external onlyOwner {
        require(withdrawableAmount <= address(this).balance, "Insufficient funds in contract");
        withdrawableAmount = 0;
        payable(owner()).transfer(withdrawableAmount);
    }

    // TODO: Remove. Only for demo
    function initializeContract() external payable onlyOwner {
        require(msg.value + address(this).balance >= 30, "Not enough volume");
        DemoHelper.setXrpPriceIndices(xrpPriceIndices);
        DemoHelper.setInitialBettings(bets);
    }

    function epochBetNumber(int epoch) external view returns (uint) {
        return bets[epoch].length;
    }

    function currentEpochBetNumber() external view returns (uint) {
        return bets[currentEpoch].length;
    }

    function betEpochsNumber(address user) external view returns (uint) {
        return betEpochs[user].length;
    }

    receive() external payable {}
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Ownable.sol";

contract Yrp is Ownable {
    struct Bet {
        address bettor;
        int priceRangeIndex;
        uint value;
        int amount;
        bool claimed;
    }

    mapping(int => Bet[]) public bets;
    mapping(int => int) public xrpPrices;
    mapping(address => int[]) public betEpochs;

    uint256 public baseBetValue = 0.05 ether;
    uint256 public scalingFactor = baseBetValue / 10;

    constructor() {
        // TODO: Replace with an oracle or other method to fetch actual XRP prices  
        xrpPrices[1] = 5;
        xrpPrices[2] = 6;
        xrpPrices[3] = 4;
    }

    function bet(int priceRangeIndex, int betEpoch, int betAmount) external payable {
        int currentEpoch = 1; // TODO: Replace to actual epoch based on block timestamp
        require(betEpoch > currentEpoch, "Bet epoch must be greater than current epoch");
        require(betEpoch < currentEpoch + 2); // TODO: Extend b-able epoch range

        int requiredValue = (int(baseBetValue) + ((currentEpoch - betEpoch) * int(scalingFactor))) * int(betAmount); // TODO: Consider exponential decay
        require(msg.value == uint(requiredValue), "Incorrect betting amount.");
        
        betEpochs[msg.sender].push(betEpoch);
        bets[betEpoch].push(Bet({
            bettor: msg.sender,
            priceRangeIndex: priceRangeIndex,
            value: msg.value,
            amount: betAmount,
            claimed: false
        }));
    }

    function claim() external {
        uint256 payoutAmount = 0;

        for (uint i = 0; i < betEpochs[msg.sender].length; i++) {
            uint256 totalBetAmountForEpoch = 0;
            int currentEpoch = betEpochs[msg.sender][i]; // TODO: Check if currentEpoch is completed
            int actualPriceIndex = xrpPrices[currentEpoch];
            int totalAmount = 0;
            int validUserAmount = 0;

            for (uint j = 0; j < bets[currentEpoch].length; j++) {
                Bet memory b = bets[currentEpoch][j];
                if (b.bettor == msg.sender && actualPriceIndex == b.priceRangeIndex && b.claimed == false) {
                    validUserAmount += b.amount;
                    bets[currentEpoch][j].claimed = true;
                }
                totalAmount += b.amount;
            }

            for (uint j = 0; j < bets[currentEpoch].length; j++) {
                totalBetAmountForEpoch += bets[currentEpoch][j].value;
            }
            
            payoutAmount += totalBetAmountForEpoch * uint(validUserAmount) / uint(totalAmount);
        }

        payoutAmount *= 0.99;

        require(payoutAmount <= address(this).balance, "Insufficient funds in contract");
        payable(msg.sender).transfer(payoutAmount);
    }

    function withdraw(uint amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient funds in contract");
        payable(owner()).transfer(amount);
    }

    // Fallback function to accept ETH deposits
    receive() external payable {}
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library DataStructs {
    struct Bet {
        address bettor;
        int priceRangeIndex;
        uint value;
        int amount;
        bool claimed;
    }
}
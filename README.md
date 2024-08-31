# YRP: Your Ripple Price 

This project is a monorepo set up for [project description PPT](). 

## Table of Contents

1. [Project Overview](#project-overview)
2. [Installation and Setup](#installation-and-setup)
3. [Project Structure](#project-structure)


## Project Overview

### Shaping the Future of XRP Markets: Collective Intelligence for Better Investment Decisions 

Description:

XRP Price Prediction Platform is a crowdsourcing-based price forecasting platform. By harnessing the collective intelligence of users, we visualize XRP market trends and provide investors with better information. Our goal is not to encourage speculation but to help market participants make more informed decisions.

Problem:

Investor uncertainty due to high volatility in the XRP market
Limitations and lack of reliability in existing prediction models
Limited access to information for individual investors
Imbalance between market psychology and technical analysis

Solution:

Crowdsourcing-based prediction platform: Utilizing collective intelligence to understand market trends
Various time-based prediction options: Supporting diverse investment strategies from short to long term
Transparent data visualization: Clearly presenting currently available information
Incentive model: Motivating participation through rewards for accurate predictions

## Installation and Setup

### Prerequisites

- **Node.js**: v14 or higher
- **pnpm**: v7 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/kws1207/YRP.git
cd YRP

# Install dependencies
pnpm install
```

### Running the Development Server

```bash
pnpm run dev
```
The development server will start, and you can view the application at http://localhost:3000.

### Production Build

```bash
# Generate a Production Build
pnpm run build

# Preview the Production Build
pnpm run preview
```

## project structure

### Contract

- Contract 1: YRP

The `Yrp` smart contract implements a prediction betting system based on XRP prices. Users can place bets on specific epochs and price ranges, and they can claim their earnings based on the outcome of their bets. The contract owner can withdraw the accumulated funds in the contract. This contract is currently designed for demo and testing purposes.

Descriptions of the main functions are as follows:

- **Betting Function (`bet` function):**

  Users can place bets on specific epochs and price ranges.  
  The function verifies the betting amount and conditions, records the bet data, and calculates the fees.

- **Claim Earnings Function (`claim` function):**

  Users can claim their earnings based on the results of their bets.  
  The function iterates through all bets of each user to calculate the payout and transfers only the unclaimed earnings.

- **Owner Withdrawal Function (`withdraw` function):**

  The contract owner can withdraw the accumulated funds in the contract.  
  The function uses the `onlyOwner` modifier to restrict access so that only the owner can call this function.


- Library 1: Datastructure

The DataStructs library defines a structure called Bet that is used in a betting system. This structure includes several properties (bettor, priceRangeIndex, value, amount, claimed) necessary for storing data related to bets. The code structure, defined as a library, is reusable and plays an important role in maintaining consistency of data within smart contracts.

```bash
library DataStructs {
    struct Bet {
        address bettor;
        int priceRangeIndex;
        uint value;
        int amount;
        bool claimed;
    }
}
```

- Library 2: DemoHelper

The DemoHelper library is primarily used for demo and testing purposes. It provides two main functions: one for setting XRP price indices and another for initializing betting data.

setXrpPriceIndices: Initializes the XRP price indices for each epoch. This function is useful for setting price data in a test environment.
setInitialBettings: Sets initial betting data. It initializes the betting data based on the price range and intensity for each epoch.

- Abstract Contract:

  - Context:

  - Ownable:


### Frontend: React + TypeScript + Vite












import { Contract } from "ethers";
import { MAX_EPOCH_DIFF } from "../constant";
import { Bets, XrpPrices } from "../types";
export async function getBets(yrpContract: Contract, currentEpoch: number) {
  const bets: Bets = {};

  const epochBetNumbers = await Promise.all(
    Array.from({ length: currentEpoch + MAX_EPOCH_DIFF + 1 }, (_, epoch) =>
      yrpContract.epochBetNumber(epoch)
    )
  );

  for (let epoch = 0; epoch <= currentEpoch + MAX_EPOCH_DIFF; epoch++) {
    const epochBetNumber = epochBetNumbers[epoch];
    const betsPromises = [];

    for (let j = 0; j < Number(epochBetNumber); j++) {
      betsPromises.push(yrpContract.bets(epoch, j));
    }

    const betsArray = await Promise.all(betsPromises);
    if (!bets[epoch]) {
      bets[epoch] = [];
    }

    betsArray.forEach((bet) => {
      bets[epoch].push({
        bettor: bet[0],
        priceRangeIndex: Number(bet[1]),
        value: Number(bet[2]) / 10 ** 18,
        amount: Number(bet[3]),
        claimed: bet[4],
      });
    });
  }

  return bets;
}

export const getXrpPrices = async (
  yrpContract: Contract,
  currentEpoch: number
) => {
  const xrpPrices: XrpPrices = {};
  const xrpPricesPromises = [];

  for (let i = 0; i <= currentEpoch + MAX_EPOCH_DIFF; i++) {
    xrpPricesPromises.push(yrpContract.xrpPriceIndices(i));
  }

  const xrpPricesArray = await Promise.all(xrpPricesPromises);
  xrpPricesArray.forEach((price, index) => {
    xrpPrices[index] = Number((Number(price) / 10 ** 16).toFixed(0));
  });

  return xrpPrices;
};

export const getUserBetEpochs = async (
  yrpContract: Contract,
  address: string,
  betEpochsNumber: number
) => {
  const betEpochsPromises = [];
  for (let i = 0; i <= betEpochsNumber; i++) {
    betEpochsPromises.push(yrpContract.betEpochs(address, i));
  }
  const betEpochs: number[] = await Promise.all(betEpochsPromises);

  return betEpochs;
};

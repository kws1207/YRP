import { useCallback, useEffect, useMemo, useState } from "react";
import { Interface, Contract, BrowserProvider } from "ethers";

import { useWallet } from "./useWallet";
import { BET_EPOCH, YRP_ABI_MAP, YRP_CONTRACT_ADDRESS } from "../constant";
import { ABIItem, Bets, XrpPrices } from "../types";
import { provider } from "../lib/provider";
import { sendTx } from "../util/tx";
import { getBets, getUserBetEpochs, getXrpPrices } from "../util/contract";
import YRP_ABI from "../assets/YRP_ABI.json";

const web3Provider = new BrowserProvider(provider);
const yrpContract = new Contract(YRP_CONTRACT_ADDRESS, YRP_ABI, web3Provider);

export function useYrp() {
  const { address } = useWallet();
  const [bets, setBets] = useState<Bets>({});
  const [xrpPrices, setXrpPrices] = useState<XrpPrices>({});
  const [betEpochs, setBetEpochs] = useState<number[]>([]);
  const [baseBetValue, setBaseBetValue] = useState(0);
  const [scalingFactor, setScalingFactor] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [currentEpochBetNumber, setCurrentEpochBetNumber] = useState(0);
  const [betEpochsNumber, setBetEpochsNumber] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [baseBetValue, scalingFactor, currentEpoch, currentEpochBetNumber] =
        await Promise.all([
          yrpContract.baseBetValue(),
          yrpContract.scalingFactor(),
          yrpContract.currentEpoch(),
          yrpContract.currentEpochBetNumber(),
        ]);

      const [xrpPrices, bets] = await Promise.all([
        getXrpPrices(yrpContract, Number(currentEpoch)),
        getBets(yrpContract, Number(currentEpoch)),
      ]);

      setXrpPrices(xrpPrices);
      setBets(bets);
      setBaseBetValue(Number(baseBetValue));
      setScalingFactor(Number(scalingFactor));
      setCurrentEpoch(Number(currentEpoch));
      setCurrentEpochBetNumber(Number(currentEpochBetNumber));
    } catch (error) {
      console.error("Error fetching data from contract:", error);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!address) return;

    const betEpochsNumber = await yrpContract.betEpochsNumber(address);
    const userBetEpochs = await getUserBetEpochs(
      yrpContract,
      address,
      betEpochsNumber
    );

    setBetEpochsNumber(betEpochsNumber);
    setBetEpochs(userBetEpochs);
  }, [address]);

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, [fetchData, fetchUserData]);

  const userBets = useMemo(() => {
    return bets[BET_EPOCH]?.filter((bet) => bet.bettor === address);
  }, [bets, address]);

  const sendBetTx = async ({
    priceRangeIndex,
    betEpoch = BET_EPOCH,
    betAmount,
  }: {
    priceRangeIndex: number;
    betEpoch?: number;
    betAmount: number;
  }) => {
    if (!address) return;

    const betABI: ABIItem = YRP_ABI_MAP.bet;
    const iface = new Interface([betABI]);
    const data = iface.encodeFunctionData("bet", [
      priceRangeIndex,
      betEpoch,
      betAmount,
    ]);

    const value =
      (baseBetValue + (currentEpoch + 1 - betEpoch) * scalingFactor) *
      betAmount;

    const res = await sendTx({
      from: address,
      to: YRP_CONTRACT_ADDRESS,
      data,
      value,
    });

    return res;
  };

  const sendClaimTx = async () => {
    if (!address) return;

    const claimABI: ABIItem = YRP_ABI_MAP.claim;
    const iface = new Interface([claimABI]);
    const data = iface.encodeFunctionData("claim", []);

    const res = await sendTx({
      from: address,
      to: YRP_CONTRACT_ADDRESS,
      data,
      value: 0,
    });

    return res;
  };

  // const calcualteEstimatedReturn = (
  //   priceRangeIndex: number,
  //   betAmount: number
  // ) => {};

  return {
    sendBetTx,
    sendClaimTx,
    userBets,
    xrpPrices,
    baseBetValue,
    scalingFactor,
    currentEpoch,
    currentEpochBetNumber,
    bets,
    betEpochs,
    betEpochsNumber,
  };
}

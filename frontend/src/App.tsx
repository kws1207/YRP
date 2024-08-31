import Chart from "./components/Chart";
import { DataPoint } from "./types";
import { useState } from "react";
import { useYrp } from "./hook/useYrp";
import { useWallet } from "./hook/useWallet";

export default function App() {
  const [betAmount, setBetAmount] = useState<number>(4);
  const [priceRangeIndex, setPriceRangeIndex] = useState<number>(-1);

  const { connect, address } = useWallet();
  const { sendBetTx } = useYrp();

  const handleConnect = async () => {
    connect();
  };

  const { bets, xrpPrices } = useYrp();
  const dataPoints: DataPoint[] = Object.entries(bets).flatMap(
    ([epoch, betArray]) =>
      betArray.map((bet) => ({
        X: epoch,
        Y: bet.priceRangeIndex,
        Z: bet.amount,
        Type: Number(epoch) < 10 ? "Past" : "Future",
      }))
  );

  const handleBet = async () => {
    await sendBetTx({
      priceRangeIndex,
      betAmount: betAmount,
    });
  };

  return (
    <div className="bg-black w-screen h-[1200px] flex flex-row items-start justify-center">
      <div className="w-[1000px] pl-[40px] py-[36px] flex flex-col items-end justify-end">
        <div className="w-full flex flex-row items-center gap-[12px]">
          <img src="/logo.svg" alt="logo" className="w-[36px] h-[36px]" />
          <div className="flex flex-col items-start justify-start">
            <span className="text-white text-[24px] font-bold">YRP</span>
            <span className="text-white text-[14px] font-normal">
              {"{ Your Ripple Price }"}
            </span>
          </div>
        </div>
        <Chart
          data={dataPoints}
          xrpPrices={xrpPrices}
          setPriceRangeIndex={setPriceRangeIndex}
        />
      </div>
      <div className="flex h-full w-[0.6px] bg-white" />
      <div className="w-[600px] py-[40px] flex flex-col gap-[48px] items-start justify-end">
        <button
          className="w-[324px] mx-[60px] bg-[#0500FF] text-white text-[20px] font-medium text-center py-[10px] rounded-[6px]"
          onClick={handleConnect}
          disabled={!!address}
        >
          {address
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : "Connect Wallet"}
        </button>
        <div className="flex flex-col items-center mx-[60px] w-[324px] rounded-[6px] border-white border-[1px]">
          <div className="flex flex-row h-[111px] items-center justify-evenly w-full">
            <div className="flex flex-col items-center justify-center">
              <span className="text-white text-[18px] font-bold">Date</span>
              <span className="text-white text-[18px] font-medium">
                {priceRangeIndex === -1 ? "-" : "2024-09-02"}
              </span>
            </div>
            <div className="flex h-[60px] w-[0.6px] bg-white" />
            <div className="flex flex-col items-center justify-center">
              <span className="text-white text-[18px] font-bold">Price</span>
              <span className="text-white text-[18px] font-medium">
                {priceRangeIndex === -1
                  ? "-"
                  : `${priceRangeIndex / 100} ~ ${(priceRangeIndex + 1) / 100}`}
              </span>
            </div>
          </div>
          <div className="flex h-[0.6px] w-full bg-white" />
          <div className="flex flex-row items-center justify-evenly w-full mt-[12px]">
            <span className="text-white text-[14px] font-medium">
              Expected Profit:
            </span>
            <span className="text-white text-[14px] font-medium">-</span>
          </div>
          <span className="text-white text-[18px] font-bold mt-[16px]">
            Total Bet Amount
          </span>
          <div className="flex flex-row items-center justify-center gap-[12px] mt-[20px]">
            <button
              className="text-white text-[14px] font-medium"
              onClick={() => setBetAmount(Math.max(betAmount - 1, 1))}
            >
              -
            </button>
            <input
              className="w-[24px] bg-transparent border-white border-[1px] text-white text-[14px] font-medium text-center"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
            />
            <button
              className="text-white text-[14px] font-medium"
              onClick={() => setBetAmount(betAmount + 1)}
            >
              +
            </button>
          </div>
          <button
            onClick={handleBet}
            className="w-[322px] bg-[#0500FF] text-white text-[20px] font-medium text-center py-[10px] rounded-[6px] mt-[24px]"
          >
            {address && priceRangeIndex !== -1
              ? `Purchase for ${(0.05 * betAmount).toFixed(2)} XRP`
              : "-"}
          </button>
        </div>
        <div className="flex h-[0.6px] w-full bg-white" />
      </div>
    </div>
  );
}

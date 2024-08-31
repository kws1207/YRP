import { useState } from "react";
import { provider } from "../lib/provider";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => {
    try {
      const res = await provider.request({
        method: "eth_requestAccounts",
      });

      if (Number(provider.networkVersion) !== 1440002) {
        alert("Please connect to the XRPL EVM Sidechain network");
        setAddress(null);
        return;
      }

      setAddress(res[0]);
    } catch {
      alert("Please install MetaMask");
      setAddress(null);
    }
  };

  return { address, connect };
}

import { provider } from "../lib/provider";

export async function sendTx({
  from,
  to,
  data,
  value = 0,
  gasLimit = 1000000,
  gasPrice = 10000000000,
}: {
  from: string;
  to: string;
  data: string;
  value: number;
  gasLimit?: number;
  gasPrice?: number;
}) {
  if (!provider) {
    alert("Please install MetaMask");
    return undefined;
  }

  try {
    const txHash = await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from,
          to,
          gas: `0x${gasLimit.toString(16)}`,
          gasPrice: `0x${gasPrice.toString(16)}`,
          value: `0x${value.toString(16)}`,
          data,
        },
      ],
    });

    return { txHash };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

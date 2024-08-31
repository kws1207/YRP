declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any;
  }
}

export interface DataPoint {
  X: string;
  Y: number;
  Z: number;
  Type: "Future" | "Past";
}

export interface Bet {
  bettor: string;
  priceRangeIndex: number;
  value: number;
  amount: number;
  claimed: boolean;
}

export type XrpPrices = { [epoch: number]: number };
export type Bets = { [epoch: number]: Bet[] };

export interface EthereumProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: (payload: any) => Promise<any>;
  networkVersion: string;
  on: (
    method: string,
    handler: ((chainId: string) => void) | ((accounts: string[]) => void)
  ) => void;
  selectedAddress: string;
}

//https://github.com/ChainSafe/web3.js/blob/8620cba19f2a9250d395e0717669b274a89521a5/packages/web3-utils/types/index.d.ts#L218

type ABIType = "function" | "constructor" | "event" | "fallback";
type StateMutabilityType = "pure" | "view" | "nonpayable" | "payable";

interface ABIInput {
  name: string;
  type: string;
  indexed?: boolean;
  components?: ABIInput[];
  internalType?: string;
}

interface ABIOutput {
  name: string;
  type: string;
  components?: ABIOutput[];
  internalType?: string;
}

export interface ABIItem {
  anonymous?: boolean;
  constant?: boolean;
  inputs?: ABIInput[];
  name?: string;
  outputs?: ABIOutput[];
  payable?: boolean;
  stateMutability?: StateMutabilityType;
  type: ABIType;
  gas?: string;
}

import { buildABIMap } from "./util/abi";
import YRP_ABI from "./assets/YRP_ABI.json";

export const YRP_CONTRACT_ADDRESS =
  "0x487b2dA63e6aFFF3fC8426285e2444a5De523537";

export const YRP_ABI_MAP = buildABIMap(YRP_ABI);

export const BET_EPOCH = 10; // TODO: Replace with actual value
export const MAX_EPOCH_DIFF = 10;

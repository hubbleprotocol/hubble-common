import { PublicKey } from "@solana/web3.js";
import { Dex } from "../../utils";

export interface GenericPoolInfo {
    dex: Dex,
    address: PublicKey
    poolTokenA: PublicKey,
    poolTokenB: PublicKey,
    price: number,
    feeRate: number,
    volumeOnLast7d: number | undefined,
    tvl: number | undefined,
}



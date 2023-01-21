import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface CollateralInfoFields {
  mint: PublicKey
  lowerHeuristic: BN
  upperHeuristic: BN
  expHeuristic: BN
  maxTwapDivergenceBps: BN
  padding: Array<BN>
}

export interface CollateralInfoJSON {
  mint: string
  lowerHeuristic: string
  upperHeuristic: string
  expHeuristic: string
  maxTwapDivergenceBps: string
  padding: Array<string>
}

export class CollateralInfo {
  readonly mint: PublicKey
  readonly lowerHeuristic: BN
  readonly upperHeuristic: BN
  readonly expHeuristic: BN
  readonly maxTwapDivergenceBps: BN
  readonly padding: Array<BN>

  constructor(fields: CollateralInfoFields) {
    this.mint = fields.mint
    this.lowerHeuristic = fields.lowerHeuristic
    this.upperHeuristic = fields.upperHeuristic
    this.expHeuristic = fields.expHeuristic
    this.maxTwapDivergenceBps = fields.maxTwapDivergenceBps
    this.padding = fields.padding
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.publicKey("mint"),
        borsh.u64("lowerHeuristic"),
        borsh.u64("upperHeuristic"),
        borsh.u64("expHeuristic"),
        borsh.u64("maxTwapDivergenceBps"),
        borsh.array(borsh.u64(), 19, "padding"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new CollateralInfo({
      mint: obj.mint,
      lowerHeuristic: obj.lowerHeuristic,
      upperHeuristic: obj.upperHeuristic,
      expHeuristic: obj.expHeuristic,
      maxTwapDivergenceBps: obj.maxTwapDivergenceBps,
      padding: obj.padding,
    })
  }

  static toEncodable(fields: CollateralInfoFields) {
    return {
      mint: fields.mint,
      lowerHeuristic: fields.lowerHeuristic,
      upperHeuristic: fields.upperHeuristic,
      expHeuristic: fields.expHeuristic,
      maxTwapDivergenceBps: fields.maxTwapDivergenceBps,
      padding: fields.padding,
    }
  }

  toJSON(): CollateralInfoJSON {
    return {
      mint: this.mint.toString(),
      lowerHeuristic: this.lowerHeuristic.toString(),
      upperHeuristic: this.upperHeuristic.toString(),
      expHeuristic: this.expHeuristic.toString(),
      maxTwapDivergenceBps: this.maxTwapDivergenceBps.toString(),
      padding: this.padding.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: CollateralInfoJSON): CollateralInfo {
    return new CollateralInfo({
      mint: new PublicKey(obj.mint),
      lowerHeuristic: new BN(obj.lowerHeuristic),
      upperHeuristic: new BN(obj.upperHeuristic),
      expHeuristic: new BN(obj.expHeuristic),
      maxTwapDivergenceBps: new BN(obj.maxTwapDivergenceBps),
      padding: obj.padding.map((item) => new BN(item)),
    })
  }

  toEncodable() {
    return CollateralInfo.toEncodable(this)
  }
}

import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface LiqPoolFields {
  lpMint: PublicKey
  lpMintAuthorityBumpSeed: number
  solLegBumpSeed: number
  msolLegAuthorityBumpSeed: number
  msolLeg: PublicKey
  /** Liquidity target. If the Liquidity reach this amount, the fee reaches lp_min_discount_fee */
  lpLiquidityTarget: BN
  /** Liquidity pool max fee */
  lpMaxFee: types.FeeFields
  /** SOL/mSOL Liquidity pool min fee */
  lpMinFee: types.FeeFields
  /** Treasury cut */
  treasuryCut: types.FeeFields
  lpSupply: BN
  lentFromSolLeg: BN
  liquiditySolCap: BN
}

export interface LiqPoolJSON {
  lpMint: string
  lpMintAuthorityBumpSeed: number
  solLegBumpSeed: number
  msolLegAuthorityBumpSeed: number
  msolLeg: string
  /** Liquidity target. If the Liquidity reach this amount, the fee reaches lp_min_discount_fee */
  lpLiquidityTarget: string
  /** Liquidity pool max fee */
  lpMaxFee: types.FeeJSON
  /** SOL/mSOL Liquidity pool min fee */
  lpMinFee: types.FeeJSON
  /** Treasury cut */
  treasuryCut: types.FeeJSON
  lpSupply: string
  lentFromSolLeg: string
  liquiditySolCap: string
}

export class LiqPool {
  readonly lpMint: PublicKey
  readonly lpMintAuthorityBumpSeed: number
  readonly solLegBumpSeed: number
  readonly msolLegAuthorityBumpSeed: number
  readonly msolLeg: PublicKey
  /** Liquidity target. If the Liquidity reach this amount, the fee reaches lp_min_discount_fee */
  readonly lpLiquidityTarget: BN
  /** Liquidity pool max fee */
  readonly lpMaxFee: types.Fee
  /** SOL/mSOL Liquidity pool min fee */
  readonly lpMinFee: types.Fee
  /** Treasury cut */
  readonly treasuryCut: types.Fee
  readonly lpSupply: BN
  readonly lentFromSolLeg: BN
  readonly liquiditySolCap: BN

  constructor(fields: LiqPoolFields) {
    this.lpMint = fields.lpMint
    this.lpMintAuthorityBumpSeed = fields.lpMintAuthorityBumpSeed
    this.solLegBumpSeed = fields.solLegBumpSeed
    this.msolLegAuthorityBumpSeed = fields.msolLegAuthorityBumpSeed
    this.msolLeg = fields.msolLeg
    this.lpLiquidityTarget = fields.lpLiquidityTarget
    this.lpMaxFee = new types.Fee({ ...fields.lpMaxFee })
    this.lpMinFee = new types.Fee({ ...fields.lpMinFee })
    this.treasuryCut = new types.Fee({ ...fields.treasuryCut })
    this.lpSupply = fields.lpSupply
    this.lentFromSolLeg = fields.lentFromSolLeg
    this.liquiditySolCap = fields.liquiditySolCap
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.publicKey("lpMint"),
        borsh.u8("lpMintAuthorityBumpSeed"),
        borsh.u8("solLegBumpSeed"),
        borsh.u8("msolLegAuthorityBumpSeed"),
        borsh.publicKey("msolLeg"),
        borsh.u64("lpLiquidityTarget"),
        types.Fee.layout("lpMaxFee"),
        types.Fee.layout("lpMinFee"),
        types.Fee.layout("treasuryCut"),
        borsh.u64("lpSupply"),
        borsh.u64("lentFromSolLeg"),
        borsh.u64("liquiditySolCap"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new LiqPool({
      lpMint: obj.lpMint,
      lpMintAuthorityBumpSeed: obj.lpMintAuthorityBumpSeed,
      solLegBumpSeed: obj.solLegBumpSeed,
      msolLegAuthorityBumpSeed: obj.msolLegAuthorityBumpSeed,
      msolLeg: obj.msolLeg,
      lpLiquidityTarget: obj.lpLiquidityTarget,
      lpMaxFee: types.Fee.fromDecoded(obj.lpMaxFee),
      lpMinFee: types.Fee.fromDecoded(obj.lpMinFee),
      treasuryCut: types.Fee.fromDecoded(obj.treasuryCut),
      lpSupply: obj.lpSupply,
      lentFromSolLeg: obj.lentFromSolLeg,
      liquiditySolCap: obj.liquiditySolCap,
    })
  }

  static toEncodable(fields: LiqPoolFields) {
    return {
      lpMint: fields.lpMint,
      lpMintAuthorityBumpSeed: fields.lpMintAuthorityBumpSeed,
      solLegBumpSeed: fields.solLegBumpSeed,
      msolLegAuthorityBumpSeed: fields.msolLegAuthorityBumpSeed,
      msolLeg: fields.msolLeg,
      lpLiquidityTarget: fields.lpLiquidityTarget,
      lpMaxFee: types.Fee.toEncodable(fields.lpMaxFee),
      lpMinFee: types.Fee.toEncodable(fields.lpMinFee),
      treasuryCut: types.Fee.toEncodable(fields.treasuryCut),
      lpSupply: fields.lpSupply,
      lentFromSolLeg: fields.lentFromSolLeg,
      liquiditySolCap: fields.liquiditySolCap,
    }
  }

  toJSON(): LiqPoolJSON {
    return {
      lpMint: this.lpMint.toString(),
      lpMintAuthorityBumpSeed: this.lpMintAuthorityBumpSeed,
      solLegBumpSeed: this.solLegBumpSeed,
      msolLegAuthorityBumpSeed: this.msolLegAuthorityBumpSeed,
      msolLeg: this.msolLeg.toString(),
      lpLiquidityTarget: this.lpLiquidityTarget.toString(),
      lpMaxFee: this.lpMaxFee.toJSON(),
      lpMinFee: this.lpMinFee.toJSON(),
      treasuryCut: this.treasuryCut.toJSON(),
      lpSupply: this.lpSupply.toString(),
      lentFromSolLeg: this.lentFromSolLeg.toString(),
      liquiditySolCap: this.liquiditySolCap.toString(),
    }
  }

  static fromJSON(obj: LiqPoolJSON): LiqPool {
    return new LiqPool({
      lpMint: new PublicKey(obj.lpMint),
      lpMintAuthorityBumpSeed: obj.lpMintAuthorityBumpSeed,
      solLegBumpSeed: obj.solLegBumpSeed,
      msolLegAuthorityBumpSeed: obj.msolLegAuthorityBumpSeed,
      msolLeg: new PublicKey(obj.msolLeg),
      lpLiquidityTarget: new BN(obj.lpLiquidityTarget),
      lpMaxFee: types.Fee.fromJSON(obj.lpMaxFee),
      lpMinFee: types.Fee.fromJSON(obj.lpMinFee),
      treasuryCut: types.Fee.fromJSON(obj.treasuryCut),
      lpSupply: new BN(obj.lpSupply),
      lentFromSolLeg: new BN(obj.lentFromSolLeg),
      liquiditySolCap: new BN(obj.liquiditySolCap),
    })
  }

  toEncodable() {
    return LiqPool.toEncodable(this)
  }
}

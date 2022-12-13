import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface KaminoRewardInfoFields {
  decimals: BN
  rewardVault: PublicKey
  rewardMint: PublicKey
  rewardCollateralId: BN
  lastIssuanceTs: BN
  rewardPerSecond: BN
  amountUncollected: BN
  amountIssuedCumulative: BN
  amountAvailable: BN
}

export interface KaminoRewardInfoJSON {
  decimals: string
  rewardVault: string
  rewardMint: string
  rewardCollateralId: string
  lastIssuanceTs: string
  rewardPerSecond: string
  amountUncollected: string
  amountIssuedCumulative: string
  amountAvailable: string
}

export class KaminoRewardInfo {
  readonly decimals: BN
  readonly rewardVault: PublicKey
  readonly rewardMint: PublicKey
  readonly rewardCollateralId: BN
  readonly lastIssuanceTs: BN
  readonly rewardPerSecond: BN
  readonly amountUncollected: BN
  readonly amountIssuedCumulative: BN
  readonly amountAvailable: BN

  constructor(fields: KaminoRewardInfoFields) {
    this.decimals = fields.decimals
    this.rewardVault = fields.rewardVault
    this.rewardMint = fields.rewardMint
    this.rewardCollateralId = fields.rewardCollateralId
    this.lastIssuanceTs = fields.lastIssuanceTs
    this.rewardPerSecond = fields.rewardPerSecond
    this.amountUncollected = fields.amountUncollected
    this.amountIssuedCumulative = fields.amountIssuedCumulative
    this.amountAvailable = fields.amountAvailable
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("decimals"),
        borsh.publicKey("rewardVault"),
        borsh.publicKey("rewardMint"),
        borsh.u64("rewardCollateralId"),
        borsh.u64("lastIssuanceTs"),
        borsh.u64("rewardPerSecond"),
        borsh.u64("amountUncollected"),
        borsh.u64("amountIssuedCumulative"),
        borsh.u64("amountAvailable"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new KaminoRewardInfo({
      decimals: obj.decimals,
      rewardVault: obj.rewardVault,
      rewardMint: obj.rewardMint,
      rewardCollateralId: obj.rewardCollateralId,
      lastIssuanceTs: obj.lastIssuanceTs,
      rewardPerSecond: obj.rewardPerSecond,
      amountUncollected: obj.amountUncollected,
      amountIssuedCumulative: obj.amountIssuedCumulative,
      amountAvailable: obj.amountAvailable,
    })
  }

  static toEncodable(fields: KaminoRewardInfoFields) {
    return {
      decimals: fields.decimals,
      rewardVault: fields.rewardVault,
      rewardMint: fields.rewardMint,
      rewardCollateralId: fields.rewardCollateralId,
      lastIssuanceTs: fields.lastIssuanceTs,
      rewardPerSecond: fields.rewardPerSecond,
      amountUncollected: fields.amountUncollected,
      amountIssuedCumulative: fields.amountIssuedCumulative,
      amountAvailable: fields.amountAvailable,
    }
  }

  toJSON(): KaminoRewardInfoJSON {
    return {
      decimals: this.decimals.toString(),
      rewardVault: this.rewardVault.toString(),
      rewardMint: this.rewardMint.toString(),
      rewardCollateralId: this.rewardCollateralId.toString(),
      lastIssuanceTs: this.lastIssuanceTs.toString(),
      rewardPerSecond: this.rewardPerSecond.toString(),
      amountUncollected: this.amountUncollected.toString(),
      amountIssuedCumulative: this.amountIssuedCumulative.toString(),
      amountAvailable: this.amountAvailable.toString(),
    }
  }

  static fromJSON(obj: KaminoRewardInfoJSON): KaminoRewardInfo {
    return new KaminoRewardInfo({
      decimals: new BN(obj.decimals),
      rewardVault: new PublicKey(obj.rewardVault),
      rewardMint: new PublicKey(obj.rewardMint),
      rewardCollateralId: new BN(obj.rewardCollateralId),
      lastIssuanceTs: new BN(obj.lastIssuanceTs),
      rewardPerSecond: new BN(obj.rewardPerSecond),
      amountUncollected: new BN(obj.amountUncollected),
      amountIssuedCumulative: new BN(obj.amountIssuedCumulative),
      amountAvailable: new BN(obj.amountAvailable),
    })
  }

  toEncodable() {
    return KaminoRewardInfo.toEncodable(this)
  }
}

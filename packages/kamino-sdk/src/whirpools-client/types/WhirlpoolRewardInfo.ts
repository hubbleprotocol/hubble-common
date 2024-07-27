import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface WhirlpoolRewardInfoFields {
  mint: PublicKey
  vault: PublicKey
  authority: PublicKey
  emissionsPerSecondX64: BN
  growthGlobalX64: BN
}

export interface WhirlpoolRewardInfoJSON {
  mint: string
  vault: string
  authority: string
  emissionsPerSecondX64: string
  growthGlobalX64: string
}

export class WhirlpoolRewardInfo {
  readonly mint: PublicKey
  readonly vault: PublicKey
  readonly authority: PublicKey
  readonly emissionsPerSecondX64: BN
  readonly growthGlobalX64: BN

  constructor(fields: WhirlpoolRewardInfoFields) {
    this.mint = fields.mint
    this.vault = fields.vault
    this.authority = fields.authority
    this.emissionsPerSecondX64 = fields.emissionsPerSecondX64
    this.growthGlobalX64 = fields.growthGlobalX64
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.publicKey("mint"),
        borsh.publicKey("vault"),
        borsh.publicKey("authority"),
        borsh.u128("emissionsPerSecondX64"),
        borsh.u128("growthGlobalX64"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new WhirlpoolRewardInfo({
      mint: obj.mint,
      vault: obj.vault,
      authority: obj.authority,
      emissionsPerSecondX64: obj.emissionsPerSecondX64,
      growthGlobalX64: obj.growthGlobalX64,
    })
  }

  static toEncodable(fields: WhirlpoolRewardInfoFields) {
    return {
      mint: fields.mint,
      vault: fields.vault,
      authority: fields.authority,
      emissionsPerSecondX64: fields.emissionsPerSecondX64,
      growthGlobalX64: fields.growthGlobalX64,
    }
  }

  toJSON(): WhirlpoolRewardInfoJSON {
    return {
      mint: this.mint.toString(),
      vault: this.vault.toString(),
      authority: this.authority.toString(),
      emissionsPerSecondX64: this.emissionsPerSecondX64.toString(),
      growthGlobalX64: this.growthGlobalX64.toString(),
    }
  }

  static fromJSON(obj: WhirlpoolRewardInfoJSON): WhirlpoolRewardInfo {
    return new WhirlpoolRewardInfo({
      mint: new PublicKey(obj.mint),
      vault: new PublicKey(obj.vault),
      authority: new PublicKey(obj.authority),
      emissionsPerSecondX64: new BN(obj.emissionsPerSecondX64),
      growthGlobalX64: new BN(obj.growthGlobalX64),
    })
  }

  toEncodable() {
    return WhirlpoolRewardInfo.toEncodable(this)
  }
}

import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AmmConfigFields {
  /** Bump to identify PDA */
  bump: number
  index: number
  /** Address of the protocol owner */
  owner: PublicKey
  /** The protocol fee */
  protocolFeeRate: number
  /** The trade fee, denominated in hundredths of a bip (10^-6) */
  tradeFeeRate: number
  /** The tick spacing */
  tickSpacing: number
  /** The fund fee, denominated in hundredths of a bip (10^-6) */
  fundFeeRate: number
  paddingU32: number
  fundOwner: PublicKey
  padding: Array<BN>
}

export interface AmmConfigJSON {
  /** Bump to identify PDA */
  bump: number
  index: number
  /** Address of the protocol owner */
  owner: string
  /** The protocol fee */
  protocolFeeRate: number
  /** The trade fee, denominated in hundredths of a bip (10^-6) */
  tradeFeeRate: number
  /** The tick spacing */
  tickSpacing: number
  /** The fund fee, denominated in hundredths of a bip (10^-6) */
  fundFeeRate: number
  paddingU32: number
  fundOwner: string
  padding: Array<string>
}

/** Holds the current owner of the factory */
export class AmmConfig {
  /** Bump to identify PDA */
  readonly bump: number
  readonly index: number
  /** Address of the protocol owner */
  readonly owner: PublicKey
  /** The protocol fee */
  readonly protocolFeeRate: number
  /** The trade fee, denominated in hundredths of a bip (10^-6) */
  readonly tradeFeeRate: number
  /** The tick spacing */
  readonly tickSpacing: number
  /** The fund fee, denominated in hundredths of a bip (10^-6) */
  readonly fundFeeRate: number
  readonly paddingU32: number
  readonly fundOwner: PublicKey
  readonly padding: Array<BN>

  static readonly discriminator = Buffer.from([
    218, 244, 33, 104, 203, 203, 43, 111,
  ])

  static readonly layout = borsh.struct([
    borsh.u8("bump"),
    borsh.u16("index"),
    borsh.publicKey("owner"),
    borsh.u32("protocolFeeRate"),
    borsh.u32("tradeFeeRate"),
    borsh.u16("tickSpacing"),
    borsh.u32("fundFeeRate"),
    borsh.u32("paddingU32"),
    borsh.publicKey("fundOwner"),
    borsh.array(borsh.u64(), 3, "padding"),
  ])

  constructor(fields: AmmConfigFields) {
    this.bump = fields.bump
    this.index = fields.index
    this.owner = fields.owner
    this.protocolFeeRate = fields.protocolFeeRate
    this.tradeFeeRate = fields.tradeFeeRate
    this.tickSpacing = fields.tickSpacing
    this.fundFeeRate = fields.fundFeeRate
    this.paddingU32 = fields.paddingU32
    this.fundOwner = fields.fundOwner
    this.padding = fields.padding
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<AmmConfig | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<AmmConfig | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): AmmConfig {
    if (!data.slice(0, 8).equals(AmmConfig.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = AmmConfig.layout.decode(data.slice(8))

    return new AmmConfig({
      bump: dec.bump,
      index: dec.index,
      owner: dec.owner,
      protocolFeeRate: dec.protocolFeeRate,
      tradeFeeRate: dec.tradeFeeRate,
      tickSpacing: dec.tickSpacing,
      fundFeeRate: dec.fundFeeRate,
      paddingU32: dec.paddingU32,
      fundOwner: dec.fundOwner,
      padding: dec.padding,
    })
  }

  toJSON(): AmmConfigJSON {
    return {
      bump: this.bump,
      index: this.index,
      owner: this.owner.toString(),
      protocolFeeRate: this.protocolFeeRate,
      tradeFeeRate: this.tradeFeeRate,
      tickSpacing: this.tickSpacing,
      fundFeeRate: this.fundFeeRate,
      paddingU32: this.paddingU32,
      fundOwner: this.fundOwner.toString(),
      padding: this.padding.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: AmmConfigJSON): AmmConfig {
    return new AmmConfig({
      bump: obj.bump,
      index: obj.index,
      owner: new PublicKey(obj.owner),
      protocolFeeRate: obj.protocolFeeRate,
      tradeFeeRate: obj.tradeFeeRate,
      tickSpacing: obj.tickSpacing,
      fundFeeRate: obj.fundFeeRate,
      paddingU32: obj.paddingU32,
      fundOwner: new PublicKey(obj.fundOwner),
      padding: obj.padding.map((item) => new BN(item)),
    })
  }
}

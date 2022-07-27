import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface WhirlpoolsConfigFields {
  feeAuthority: PublicKey
  collectProtocolFeesAuthority: PublicKey
  rewardEmissionsSuperAuthority: PublicKey
  defaultProtocolFeeRate: number
}

export interface WhirlpoolsConfigJSON {
  feeAuthority: string
  collectProtocolFeesAuthority: string
  rewardEmissionsSuperAuthority: string
  defaultProtocolFeeRate: number
}

export class WhirlpoolsConfig {
  readonly feeAuthority: PublicKey
  readonly collectProtocolFeesAuthority: PublicKey
  readonly rewardEmissionsSuperAuthority: PublicKey
  readonly defaultProtocolFeeRate: number

  static readonly discriminator = Buffer.from([
    157, 20, 49, 224, 217, 87, 193, 254,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("feeAuthority"),
    borsh.publicKey("collectProtocolFeesAuthority"),
    borsh.publicKey("rewardEmissionsSuperAuthority"),
    borsh.u16("defaultProtocolFeeRate"),
  ])

  constructor(fields: WhirlpoolsConfigFields) {
    this.feeAuthority = fields.feeAuthority
    this.collectProtocolFeesAuthority = fields.collectProtocolFeesAuthority
    this.rewardEmissionsSuperAuthority = fields.rewardEmissionsSuperAuthority
    this.defaultProtocolFeeRate = fields.defaultProtocolFeeRate
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<WhirlpoolsConfig | null> {
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
  ): Promise<Array<WhirlpoolsConfig | null>> {
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

  static decode(data: Buffer): WhirlpoolsConfig {
    if (!data.slice(0, 8).equals(WhirlpoolsConfig.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = WhirlpoolsConfig.layout.decode(data.slice(8))

    return new WhirlpoolsConfig({
      feeAuthority: dec.feeAuthority,
      collectProtocolFeesAuthority: dec.collectProtocolFeesAuthority,
      rewardEmissionsSuperAuthority: dec.rewardEmissionsSuperAuthority,
      defaultProtocolFeeRate: dec.defaultProtocolFeeRate,
    })
  }

  toJSON(): WhirlpoolsConfigJSON {
    return {
      feeAuthority: this.feeAuthority.toString(),
      collectProtocolFeesAuthority:
        this.collectProtocolFeesAuthority.toString(),
      rewardEmissionsSuperAuthority:
        this.rewardEmissionsSuperAuthority.toString(),
      defaultProtocolFeeRate: this.defaultProtocolFeeRate,
    }
  }

  static fromJSON(obj: WhirlpoolsConfigJSON): WhirlpoolsConfig {
    return new WhirlpoolsConfig({
      feeAuthority: new PublicKey(obj.feeAuthority),
      collectProtocolFeesAuthority: new PublicKey(
        obj.collectProtocolFeesAuthority
      ),
      rewardEmissionsSuperAuthority: new PublicKey(
        obj.rewardEmissionsSuperAuthority
      ),
      defaultProtocolFeeRate: obj.defaultProtocolFeeRate,
    })
  }
}

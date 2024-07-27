import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface PositionBundleFields {
  positionBundleMint: PublicKey
  positionBitmap: Array<number>
}

export interface PositionBundleJSON {
  positionBundleMint: string
  positionBitmap: Array<number>
}

export class PositionBundle {
  readonly positionBundleMint: PublicKey
  readonly positionBitmap: Array<number>

  static readonly discriminator = Buffer.from([
    129, 169, 175, 65, 185, 95, 32, 100,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("positionBundleMint"),
    borsh.array(borsh.u8(), 32, "positionBitmap"),
  ])

  constructor(fields: PositionBundleFields) {
    this.positionBundleMint = fields.positionBundleMint
    this.positionBitmap = fields.positionBitmap
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = WHIRLPOOL_PROGRAM_ID
  ): Promise<PositionBundle | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[],
    programId: PublicKey = WHIRLPOOL_PROGRAM_ID
  ): Promise<Array<PositionBundle | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(programId)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): PositionBundle {
    if (!data.slice(0, 8).equals(PositionBundle.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = PositionBundle.layout.decode(data.slice(8))

    return new PositionBundle({
      positionBundleMint: dec.positionBundleMint,
      positionBitmap: dec.positionBitmap,
    })
  }

  toJSON(): PositionBundleJSON {
    return {
      positionBundleMint: this.positionBundleMint.toString(),
      positionBitmap: this.positionBitmap,
    }
  }

  static fromJSON(obj: PositionBundleJSON): PositionBundle {
    return new PositionBundle({
      positionBundleMint: new PublicKey(obj.positionBundleMint),
      positionBitmap: obj.positionBitmap,
    })
  }
}

import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface OperationStateFields {
  /** Bump to identify PDA */
  bump: number
  /** Address of the operation owner */
  operationOwners: Array<PublicKey>
  /** The mint address of whitelist to emmit reward */
  whitelistMints: Array<PublicKey>
}

export interface OperationStateJSON {
  /** Bump to identify PDA */
  bump: number
  /** Address of the operation owner */
  operationOwners: Array<string>
  /** The mint address of whitelist to emmit reward */
  whitelistMints: Array<string>
}

/** Holds the current owner of the factory */
export class OperationState {
  /** Bump to identify PDA */
  readonly bump: number
  /** Address of the operation owner */
  readonly operationOwners: Array<PublicKey>
  /** The mint address of whitelist to emmit reward */
  readonly whitelistMints: Array<PublicKey>

  static readonly discriminator = Buffer.from([
    19, 236, 58, 237, 81, 222, 183, 252,
  ])

  static readonly layout = borsh.struct([
    borsh.u8("bump"),
    borsh.array(borsh.publicKey(), 10, "operationOwners"),
    borsh.array(borsh.publicKey(), 100, "whitelistMints"),
  ])

  constructor(fields: OperationStateFields) {
    this.bump = fields.bump
    this.operationOwners = fields.operationOwners
    this.whitelistMints = fields.whitelistMints
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<OperationState | null> {
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
  ): Promise<Array<OperationState | null>> {
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

  static decode(data: Buffer): OperationState {
    if (!data.slice(0, 8).equals(OperationState.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = OperationState.layout.decode(data.slice(8))

    return new OperationState({
      bump: dec.bump,
      operationOwners: dec.operationOwners,
      whitelistMints: dec.whitelistMints,
    })
  }

  toJSON(): OperationStateJSON {
    return {
      bump: this.bump,
      operationOwners: this.operationOwners.map((item) => item.toString()),
      whitelistMints: this.whitelistMints.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: OperationStateJSON): OperationState {
    return new OperationState({
      bump: obj.bump,
      operationOwners: obj.operationOwners.map((item) => new PublicKey(item)),
      whitelistMints: obj.whitelistMints.map((item) => new PublicKey(item)),
    })
  }
}

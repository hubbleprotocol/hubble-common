import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface InitPermissionPairIxFields {
  activeId: number
  binStep: number
  baseFactor: number
  minBinId: number
  maxBinId: number
  lockDurationInSlot: BN
}

export interface InitPermissionPairIxJSON {
  activeId: number
  binStep: number
  baseFactor: number
  minBinId: number
  maxBinId: number
  lockDurationInSlot: string
}

export class InitPermissionPairIx {
  readonly activeId: number
  readonly binStep: number
  readonly baseFactor: number
  readonly minBinId: number
  readonly maxBinId: number
  readonly lockDurationInSlot: BN

  constructor(fields: InitPermissionPairIxFields) {
    this.activeId = fields.activeId
    this.binStep = fields.binStep
    this.baseFactor = fields.baseFactor
    this.minBinId = fields.minBinId
    this.maxBinId = fields.maxBinId
    this.lockDurationInSlot = fields.lockDurationInSlot
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.i32("activeId"),
        borsh.u16("binStep"),
        borsh.u16("baseFactor"),
        borsh.i32("minBinId"),
        borsh.i32("maxBinId"),
        borsh.u64("lockDurationInSlot"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new InitPermissionPairIx({
      activeId: obj.activeId,
      binStep: obj.binStep,
      baseFactor: obj.baseFactor,
      minBinId: obj.minBinId,
      maxBinId: obj.maxBinId,
      lockDurationInSlot: obj.lockDurationInSlot,
    })
  }

  static toEncodable(fields: InitPermissionPairIxFields) {
    return {
      activeId: fields.activeId,
      binStep: fields.binStep,
      baseFactor: fields.baseFactor,
      minBinId: fields.minBinId,
      maxBinId: fields.maxBinId,
      lockDurationInSlot: fields.lockDurationInSlot,
    }
  }

  toJSON(): InitPermissionPairIxJSON {
    return {
      activeId: this.activeId,
      binStep: this.binStep,
      baseFactor: this.baseFactor,
      minBinId: this.minBinId,
      maxBinId: this.maxBinId,
      lockDurationInSlot: this.lockDurationInSlot.toString(),
    }
  }

  static fromJSON(obj: InitPermissionPairIxJSON): InitPermissionPairIx {
    return new InitPermissionPairIx({
      activeId: obj.activeId,
      binStep: obj.binStep,
      baseFactor: obj.baseFactor,
      minBinId: obj.minBinId,
      maxBinId: obj.maxBinId,
      lockDurationInSlot: new BN(obj.lockDurationInSlot),
    })
  }

  toEncodable() {
    return InitPermissionPairIx.toEncodable(this)
  }
}

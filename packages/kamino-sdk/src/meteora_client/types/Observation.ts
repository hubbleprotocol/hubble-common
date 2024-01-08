import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ObservationFields {
  /** Cumulative active bin ID */
  cumulativeActiveBinId: BN
  /** Observation sample created timestamp */
  createdAt: BN
  /** Observation sample last updated timestamp */
  lastUpdatedAt: BN
}

export interface ObservationJSON {
  /** Cumulative active bin ID */
  cumulativeActiveBinId: string
  /** Observation sample created timestamp */
  createdAt: string
  /** Observation sample last updated timestamp */
  lastUpdatedAt: string
}

export class Observation {
  /** Cumulative active bin ID */
  readonly cumulativeActiveBinId: BN
  /** Observation sample created timestamp */
  readonly createdAt: BN
  /** Observation sample last updated timestamp */
  readonly lastUpdatedAt: BN

  constructor(fields: ObservationFields) {
    this.cumulativeActiveBinId = fields.cumulativeActiveBinId
    this.createdAt = fields.createdAt
    this.lastUpdatedAt = fields.lastUpdatedAt
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.i128("cumulativeActiveBinId"),
        borsh.i64("createdAt"),
        borsh.i64("lastUpdatedAt"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Observation({
      cumulativeActiveBinId: obj.cumulativeActiveBinId,
      createdAt: obj.createdAt,
      lastUpdatedAt: obj.lastUpdatedAt,
    })
  }

  static toEncodable(fields: ObservationFields) {
    return {
      cumulativeActiveBinId: fields.cumulativeActiveBinId,
      createdAt: fields.createdAt,
      lastUpdatedAt: fields.lastUpdatedAt,
    }
  }

  toJSON(): ObservationJSON {
    return {
      cumulativeActiveBinId: this.cumulativeActiveBinId.toString(),
      createdAt: this.createdAt.toString(),
      lastUpdatedAt: this.lastUpdatedAt.toString(),
    }
  }

  static fromJSON(obj: ObservationJSON): Observation {
    return new Observation({
      cumulativeActiveBinId: new BN(obj.cumulativeActiveBinId),
      createdAt: new BN(obj.createdAt),
      lastUpdatedAt: new BN(obj.lastUpdatedAt),
    })
  }

  toEncodable() {
    return Observation.toEncodable(this)
  }
}

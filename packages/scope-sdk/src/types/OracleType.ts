import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface PythJSON {
  kind: "Pyth"
}

export class Pyth {
  static readonly discriminator = 0
  static readonly kind = "Pyth"
  readonly discriminator = 0
  readonly kind = "Pyth"

  toJSON(): PythJSON {
    return {
      kind: "Pyth",
    }
  }

  toEncodable() {
    return {
      Pyth: {},
    }
  }
}

export interface SwitchboardV1JSON {
  kind: "SwitchboardV1"
}

export class SwitchboardV1 {
  static readonly discriminator = 1
  static readonly kind = "SwitchboardV1"
  readonly discriminator = 1
  readonly kind = "SwitchboardV1"

  toJSON(): SwitchboardV1JSON {
    return {
      kind: "SwitchboardV1",
    }
  }

  toEncodable() {
    return {
      SwitchboardV1: {},
    }
  }
}

export interface SwitchboardV2JSON {
  kind: "SwitchboardV2"
}

export class SwitchboardV2 {
  static readonly discriminator = 2
  static readonly kind = "SwitchboardV2"
  readonly discriminator = 2
  readonly kind = "SwitchboardV2"

  toJSON(): SwitchboardV2JSON {
    return {
      kind: "SwitchboardV2",
    }
  }

  toEncodable() {
    return {
      SwitchboardV2: {},
    }
  }
}

export interface CTokenJSON {
  kind: "CToken"
}

export class CToken {
  static readonly discriminator = 3
  static readonly kind = "CToken"
  readonly discriminator = 3
  readonly kind = "CToken"

  toJSON(): CTokenJSON {
    return {
      kind: "CToken",
    }
  }

  toEncodable() {
    return {
      CToken: {},
    }
  }
}

export interface SplStakeJSON {
  kind: "SplStake"
}

export class SplStake {
  static readonly discriminator = 4
  static readonly kind = "SplStake"
  readonly discriminator = 4
  readonly kind = "SplStake"

  toJSON(): SplStakeJSON {
    return {
      kind: "SplStake",
    }
  }

  toEncodable() {
    return {
      SplStake: {},
    }
  }
}

export interface KTokenJSON {
  kind: "KToken"
}

export class KToken {
  static readonly discriminator = 5
  static readonly kind = "KToken"
  readonly discriminator = 5
  readonly kind = "KToken"

  toJSON(): KTokenJSON {
    return {
      kind: "KToken",
    }
  }

  toEncodable() {
    return {
      KToken: {},
    }
  }
}

export interface PythEMAJSON {
  kind: "PythEMA"
}

export class PythEMA {
  static readonly discriminator = 6
  static readonly kind = "PythEMA"
  readonly discriminator = 6
  readonly kind = "PythEMA"

  toJSON(): PythEMAJSON {
    return {
      kind: "PythEMA",
    }
  }

  toEncodable() {
    return {
      PythEMA: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.OracleTypeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Pyth" in obj) {
    return new Pyth()
  }
  if ("SwitchboardV1" in obj) {
    return new SwitchboardV1()
  }
  if ("SwitchboardV2" in obj) {
    return new SwitchboardV2()
  }
  if ("CToken" in obj) {
    return new CToken()
  }
  if ("SplStake" in obj) {
    return new SplStake()
  }
  if ("KToken" in obj) {
    return new KToken()
  }
  if ("PythEMA" in obj) {
    return new PythEMA()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.OracleTypeJSON): types.OracleTypeKind {
  switch (obj.kind) {
    case "Pyth": {
      return new Pyth()
    }
    case "SwitchboardV1": {
      return new SwitchboardV1()
    }
    case "SwitchboardV2": {
      return new SwitchboardV2()
    }
    case "CToken": {
      return new CToken()
    }
    case "SplStake": {
      return new SplStake()
    }
    case "KToken": {
      return new KToken()
    }
    case "PythEMA": {
      return new PythEMA()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Pyth"),
    borsh.struct([], "SwitchboardV1"),
    borsh.struct([], "SwitchboardV2"),
    borsh.struct([], "CToken"),
    borsh.struct([], "SplStake"),
    borsh.struct([], "KToken"),
    borsh.struct([], "PythEMA"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export type ExpandOrContractFields = [number]
export type ExpandOrContractValue = [number]

export interface ExpandOrContractJSON {
  kind: "ExpandOrContract"
  value: [number]
}

export class ExpandOrContract {
  static readonly discriminator = 0
  static readonly kind = "ExpandOrContract"
  readonly discriminator = 0
  readonly kind = "ExpandOrContract"
  readonly value: ExpandOrContractValue

  constructor(value: ExpandOrContractFields) {
    this.value = [value[0]]
  }

  toJSON(): ExpandOrContractJSON {
    return {
      kind: "ExpandOrContract",
      value: [this.value[0]],
    }
  }

  toEncodable() {
    return {
      ExpandOrContract: {
        _0: this.value[0],
      },
    }
  }
}

export interface RecenterJSON {
  kind: "Recenter"
}

export class Recenter {
  static readonly discriminator = 1
  static readonly kind = "Recenter"
  readonly discriminator = 1
  readonly kind = "Recenter"

  toJSON(): RecenterJSON {
    return {
      kind: "Recenter",
    }
  }

  toEncodable() {
    return {
      Recenter: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.ExpanderStepKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("ExpandOrContract" in obj) {
    const val = obj["ExpandOrContract"]
    return new ExpandOrContract([val["_0"]])
  }
  if ("Recenter" in obj) {
    return new Recenter()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.ExpanderStepJSON): types.ExpanderStepKind {
  switch (obj.kind) {
    case "ExpandOrContract": {
      return new ExpandOrContract([obj.value[0]])
    }
    case "Recenter": {
      return new Recenter()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([borsh.u16("_0")], "ExpandOrContract"),
    borsh.struct([], "Recenter"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

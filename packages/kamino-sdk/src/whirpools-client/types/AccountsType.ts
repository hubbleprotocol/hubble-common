import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface TransferHookAJSON {
  kind: "TransferHookA"
}

export class TransferHookA {
  static readonly discriminator = 0
  static readonly kind = "TransferHookA"
  readonly discriminator = 0
  readonly kind = "TransferHookA"

  toJSON(): TransferHookAJSON {
    return {
      kind: "TransferHookA",
    }
  }

  toEncodable() {
    return {
      TransferHookA: {},
    }
  }
}

export interface TransferHookBJSON {
  kind: "TransferHookB"
}

export class TransferHookB {
  static readonly discriminator = 1
  static readonly kind = "TransferHookB"
  readonly discriminator = 1
  readonly kind = "TransferHookB"

  toJSON(): TransferHookBJSON {
    return {
      kind: "TransferHookB",
    }
  }

  toEncodable() {
    return {
      TransferHookB: {},
    }
  }
}

export interface TransferHookRewardJSON {
  kind: "TransferHookReward"
}

export class TransferHookReward {
  static readonly discriminator = 2
  static readonly kind = "TransferHookReward"
  readonly discriminator = 2
  readonly kind = "TransferHookReward"

  toJSON(): TransferHookRewardJSON {
    return {
      kind: "TransferHookReward",
    }
  }

  toEncodable() {
    return {
      TransferHookReward: {},
    }
  }
}

export interface TransferHookInputJSON {
  kind: "TransferHookInput"
}

export class TransferHookInput {
  static readonly discriminator = 3
  static readonly kind = "TransferHookInput"
  readonly discriminator = 3
  readonly kind = "TransferHookInput"

  toJSON(): TransferHookInputJSON {
    return {
      kind: "TransferHookInput",
    }
  }

  toEncodable() {
    return {
      TransferHookInput: {},
    }
  }
}

export interface TransferHookIntermediateJSON {
  kind: "TransferHookIntermediate"
}

export class TransferHookIntermediate {
  static readonly discriminator = 4
  static readonly kind = "TransferHookIntermediate"
  readonly discriminator = 4
  readonly kind = "TransferHookIntermediate"

  toJSON(): TransferHookIntermediateJSON {
    return {
      kind: "TransferHookIntermediate",
    }
  }

  toEncodable() {
    return {
      TransferHookIntermediate: {},
    }
  }
}

export interface TransferHookOutputJSON {
  kind: "TransferHookOutput"
}

export class TransferHookOutput {
  static readonly discriminator = 5
  static readonly kind = "TransferHookOutput"
  readonly discriminator = 5
  readonly kind = "TransferHookOutput"

  toJSON(): TransferHookOutputJSON {
    return {
      kind: "TransferHookOutput",
    }
  }

  toEncodable() {
    return {
      TransferHookOutput: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.AccountsTypeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("TransferHookA" in obj) {
    return new TransferHookA()
  }
  if ("TransferHookB" in obj) {
    return new TransferHookB()
  }
  if ("TransferHookReward" in obj) {
    return new TransferHookReward()
  }
  if ("TransferHookInput" in obj) {
    return new TransferHookInput()
  }
  if ("TransferHookIntermediate" in obj) {
    return new TransferHookIntermediate()
  }
  if ("TransferHookOutput" in obj) {
    return new TransferHookOutput()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.AccountsTypeJSON): types.AccountsTypeKind {
  switch (obj.kind) {
    case "TransferHookA": {
      return new TransferHookA()
    }
    case "TransferHookB": {
      return new TransferHookB()
    }
    case "TransferHookReward": {
      return new TransferHookReward()
    }
    case "TransferHookInput": {
      return new TransferHookInput()
    }
    case "TransferHookIntermediate": {
      return new TransferHookIntermediate()
    }
    case "TransferHookOutput": {
      return new TransferHookOutput()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "TransferHookA"),
    borsh.struct([], "TransferHookB"),
    borsh.struct([], "TransferHookReward"),
    borsh.struct([], "TransferHookInput"),
    borsh.struct([], "TransferHookIntermediate"),
    borsh.struct([], "TransferHookOutput"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

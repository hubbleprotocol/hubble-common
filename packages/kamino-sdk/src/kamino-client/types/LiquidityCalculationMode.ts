import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface DepositJSON {
  kind: "Deposit"
}

export class Deposit {
  static readonly discriminator = 0
  static readonly kind = "Deposit"
  readonly discriminator = 0
  readonly kind = "Deposit"

  toJSON(): DepositJSON {
    return {
      kind: "Deposit",
    }
  }

  toEncodable() {
    return {
      Deposit: {},
    }
  }
}

export interface WithdrawJSON {
  kind: "Withdraw"
}

export class Withdraw {
  static readonly discriminator = 1
  static readonly kind = "Withdraw"
  readonly discriminator = 1
  readonly kind = "Withdraw"

  toJSON(): WithdrawJSON {
    return {
      kind: "Withdraw",
    }
  }

  toEncodable() {
    return {
      Withdraw: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.LiquidityCalculationModeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Deposit" in obj) {
    return new Deposit()
  }
  if ("Withdraw" in obj) {
    return new Withdraw()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.LiquidityCalculationModeJSON
): types.LiquidityCalculationModeKind {
  switch (obj.kind) {
    case "Deposit": {
      return new Deposit()
    }
    case "Withdraw": {
      return new Withdraw()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Deposit"),
    borsh.struct([], "Withdraw"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

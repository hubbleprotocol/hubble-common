import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

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

export interface DeprecatedPlaceholder1JSON {
  kind: "DeprecatedPlaceholder1"
}

export class DeprecatedPlaceholder1 {
  static readonly discriminator = 1
  static readonly kind = "DeprecatedPlaceholder1"
  readonly discriminator = 1
  readonly kind = "DeprecatedPlaceholder1"

  toJSON(): DeprecatedPlaceholder1JSON {
    return {
      kind: "DeprecatedPlaceholder1",
    }
  }

  toEncodable() {
    return {
      DeprecatedPlaceholder1: {},
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

export interface DeprecatedPlaceholder2JSON {
  kind: "DeprecatedPlaceholder2"
}

export class DeprecatedPlaceholder2 {
  static readonly discriminator = 3
  static readonly kind = "DeprecatedPlaceholder2"
  readonly discriminator = 3
  readonly kind = "DeprecatedPlaceholder2"

  toJSON(): DeprecatedPlaceholder2JSON {
    return {
      kind: "DeprecatedPlaceholder2",
    }
  }

  toEncodable() {
    return {
      DeprecatedPlaceholder2: {},
    }
  }
}

export interface CTokenJSON {
  kind: "CToken"
}

export class CToken {
  static readonly discriminator = 4
  static readonly kind = "CToken"
  readonly discriminator = 4
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
  static readonly discriminator = 5
  static readonly kind = "SplStake"
  readonly discriminator = 5
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
  static readonly discriminator = 6
  static readonly kind = "KToken"
  readonly discriminator = 6
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
  static readonly discriminator = 7
  static readonly kind = "PythEMA"
  readonly discriminator = 7
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

export interface MsolStakeJSON {
  kind: "MsolStake"
}

export class MsolStake {
  static readonly discriminator = 8
  static readonly kind = "MsolStake"
  readonly discriminator = 8
  readonly kind = "MsolStake"

  toJSON(): MsolStakeJSON {
    return {
      kind: "MsolStake",
    }
  }

  toEncodable() {
    return {
      MsolStake: {},
    }
  }
}

export interface KTokenToTokenAJSON {
  kind: "KTokenToTokenA"
}

export class KTokenToTokenA {
  static readonly discriminator = 9
  static readonly kind = "KTokenToTokenA"
  readonly discriminator = 9
  readonly kind = "KTokenToTokenA"

  toJSON(): KTokenToTokenAJSON {
    return {
      kind: "KTokenToTokenA",
    }
  }

  toEncodable() {
    return {
      KTokenToTokenA: {},
    }
  }
}

export interface KTokenToTokenBJSON {
  kind: "KTokenToTokenB"
}

export class KTokenToTokenB {
  static readonly discriminator = 10
  static readonly kind = "KTokenToTokenB"
  readonly discriminator = 10
  readonly kind = "KTokenToTokenB"

  toJSON(): KTokenToTokenBJSON {
    return {
      kind: "KTokenToTokenB",
    }
  }

  toEncodable() {
    return {
      KTokenToTokenB: {},
    }
  }
}

export interface JupiterLpFetchJSON {
  kind: "JupiterLpFetch"
}

export class JupiterLpFetch {
  static readonly discriminator = 11
  static readonly kind = "JupiterLpFetch"
  readonly discriminator = 11
  readonly kind = "JupiterLpFetch"

  toJSON(): JupiterLpFetchJSON {
    return {
      kind: "JupiterLpFetch",
    }
  }

  toEncodable() {
    return {
      JupiterLpFetch: {},
    }
  }
}

export interface ScopeTwapJSON {
  kind: "ScopeTwap"
}

export class ScopeTwap {
  static readonly discriminator = 12
  static readonly kind = "ScopeTwap"
  readonly discriminator = 12
  readonly kind = "ScopeTwap"

  toJSON(): ScopeTwapJSON {
    return {
      kind: "ScopeTwap",
    }
  }

  toEncodable() {
    return {
      ScopeTwap: {},
    }
  }
}

export interface OrcaWhirlpoolAtoBJSON {
  kind: "OrcaWhirlpoolAtoB"
}

export class OrcaWhirlpoolAtoB {
  static readonly discriminator = 13
  static readonly kind = "OrcaWhirlpoolAtoB"
  readonly discriminator = 13
  readonly kind = "OrcaWhirlpoolAtoB"

  toJSON(): OrcaWhirlpoolAtoBJSON {
    return {
      kind: "OrcaWhirlpoolAtoB",
    }
  }

  toEncodable() {
    return {
      OrcaWhirlpoolAtoB: {},
    }
  }
}

export interface OrcaWhirlpoolBtoAJSON {
  kind: "OrcaWhirlpoolBtoA"
}

export class OrcaWhirlpoolBtoA {
  static readonly discriminator = 14
  static readonly kind = "OrcaWhirlpoolBtoA"
  readonly discriminator = 14
  readonly kind = "OrcaWhirlpoolBtoA"

  toJSON(): OrcaWhirlpoolBtoAJSON {
    return {
      kind: "OrcaWhirlpoolBtoA",
    }
  }

  toEncodable() {
    return {
      OrcaWhirlpoolBtoA: {},
    }
  }
}

export interface RaydiumAmmV3AtoBJSON {
  kind: "RaydiumAmmV3AtoB"
}

export class RaydiumAmmV3AtoB {
  static readonly discriminator = 15
  static readonly kind = "RaydiumAmmV3AtoB"
  readonly discriminator = 15
  readonly kind = "RaydiumAmmV3AtoB"

  toJSON(): RaydiumAmmV3AtoBJSON {
    return {
      kind: "RaydiumAmmV3AtoB",
    }
  }

  toEncodable() {
    return {
      RaydiumAmmV3AtoB: {},
    }
  }
}

export interface RaydiumAmmV3BtoAJSON {
  kind: "RaydiumAmmV3BtoA"
}

export class RaydiumAmmV3BtoA {
  static readonly discriminator = 16
  static readonly kind = "RaydiumAmmV3BtoA"
  readonly discriminator = 16
  readonly kind = "RaydiumAmmV3BtoA"

  toJSON(): RaydiumAmmV3BtoAJSON {
    return {
      kind: "RaydiumAmmV3BtoA",
    }
  }

  toEncodable() {
    return {
      RaydiumAmmV3BtoA: {},
    }
  }
}

export interface JupiterLpComputeJSON {
  kind: "JupiterLpCompute"
}

export class JupiterLpCompute {
  static readonly discriminator = 17
  static readonly kind = "JupiterLpCompute"
  readonly discriminator = 17
  readonly kind = "JupiterLpCompute"

  toJSON(): JupiterLpComputeJSON {
    return {
      kind: "JupiterLpCompute",
    }
  }

  toEncodable() {
    return {
      JupiterLpCompute: {},
    }
  }
}

export interface MeteoraDlmmAtoBJSON {
  kind: "MeteoraDlmmAtoB"
}

export class MeteoraDlmmAtoB {
  static readonly discriminator = 18
  static readonly kind = "MeteoraDlmmAtoB"
  readonly discriminator = 18
  readonly kind = "MeteoraDlmmAtoB"

  toJSON(): MeteoraDlmmAtoBJSON {
    return {
      kind: "MeteoraDlmmAtoB",
    }
  }

  toEncodable() {
    return {
      MeteoraDlmmAtoB: {},
    }
  }
}

export interface MeteoraDlmmBtoAJSON {
  kind: "MeteoraDlmmBtoA"
}

export class MeteoraDlmmBtoA {
  static readonly discriminator = 19
  static readonly kind = "MeteoraDlmmBtoA"
  readonly discriminator = 19
  readonly kind = "MeteoraDlmmBtoA"

  toJSON(): MeteoraDlmmBtoAJSON {
    return {
      kind: "MeteoraDlmmBtoA",
    }
  }

  toEncodable() {
    return {
      MeteoraDlmmBtoA: {},
    }
  }
}

export interface JupiterLpScopeJSON {
  kind: "JupiterLpScope"
}

export class JupiterLpScope {
  static readonly discriminator = 20
  static readonly kind = "JupiterLpScope"
  readonly discriminator = 20
  readonly kind = "JupiterLpScope"

  toJSON(): JupiterLpScopeJSON {
    return {
      kind: "JupiterLpScope",
    }
  }

  toEncodable() {
    return {
      JupiterLpScope: {},
    }
  }
}

export interface PythPullBasedJSON {
  kind: "PythPullBased"
}

export class PythPullBased {
  static readonly discriminator = 21
  static readonly kind = "PythPullBased"
  readonly discriminator = 21
  readonly kind = "PythPullBased"

  toJSON(): PythPullBasedJSON {
    return {
      kind: "PythPullBased",
    }
  }

  toEncodable() {
    return {
      PythPullBased: {},
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
  if ("DeprecatedPlaceholder1" in obj) {
    return new DeprecatedPlaceholder1()
  }
  if ("SwitchboardV2" in obj) {
    return new SwitchboardV2()
  }
  if ("DeprecatedPlaceholder2" in obj) {
    return new DeprecatedPlaceholder2()
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
  if ("MsolStake" in obj) {
    return new MsolStake()
  }
  if ("KTokenToTokenA" in obj) {
    return new KTokenToTokenA()
  }
  if ("KTokenToTokenB" in obj) {
    return new KTokenToTokenB()
  }
  if ("JupiterLpFetch" in obj) {
    return new JupiterLpFetch()
  }
  if ("ScopeTwap" in obj) {
    return new ScopeTwap()
  }
  if ("OrcaWhirlpoolAtoB" in obj) {
    return new OrcaWhirlpoolAtoB()
  }
  if ("OrcaWhirlpoolBtoA" in obj) {
    return new OrcaWhirlpoolBtoA()
  }
  if ("RaydiumAmmV3AtoB" in obj) {
    return new RaydiumAmmV3AtoB()
  }
  if ("RaydiumAmmV3BtoA" in obj) {
    return new RaydiumAmmV3BtoA()
  }
  if ("JupiterLpCompute" in obj) {
    return new JupiterLpCompute()
  }
  if ("MeteoraDlmmAtoB" in obj) {
    return new MeteoraDlmmAtoB()
  }
  if ("MeteoraDlmmBtoA" in obj) {
    return new MeteoraDlmmBtoA()
  }
  if ("JupiterLpScope" in obj) {
    return new JupiterLpScope()
  }
  if ("PythPullBased" in obj) {
    return new PythPullBased()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.OracleTypeJSON): types.OracleTypeKind {
  switch (obj.kind) {
    case "Pyth": {
      return new Pyth()
    }
    case "DeprecatedPlaceholder1": {
      return new DeprecatedPlaceholder1()
    }
    case "SwitchboardV2": {
      return new SwitchboardV2()
    }
    case "DeprecatedPlaceholder2": {
      return new DeprecatedPlaceholder2()
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
    case "MsolStake": {
      return new MsolStake()
    }
    case "KTokenToTokenA": {
      return new KTokenToTokenA()
    }
    case "KTokenToTokenB": {
      return new KTokenToTokenB()
    }
    case "JupiterLpFetch": {
      return new JupiterLpFetch()
    }
    case "ScopeTwap": {
      return new ScopeTwap()
    }
    case "OrcaWhirlpoolAtoB": {
      return new OrcaWhirlpoolAtoB()
    }
    case "OrcaWhirlpoolBtoA": {
      return new OrcaWhirlpoolBtoA()
    }
    case "RaydiumAmmV3AtoB": {
      return new RaydiumAmmV3AtoB()
    }
    case "RaydiumAmmV3BtoA": {
      return new RaydiumAmmV3BtoA()
    }
    case "JupiterLpCompute": {
      return new JupiterLpCompute()
    }
    case "MeteoraDlmmAtoB": {
      return new MeteoraDlmmAtoB()
    }
    case "MeteoraDlmmBtoA": {
      return new MeteoraDlmmBtoA()
    }
    case "JupiterLpScope": {
      return new JupiterLpScope()
    }
    case "PythPullBased": {
      return new PythPullBased()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Pyth"),
    borsh.struct([], "DeprecatedPlaceholder1"),
    borsh.struct([], "SwitchboardV2"),
    borsh.struct([], "DeprecatedPlaceholder2"),
    borsh.struct([], "CToken"),
    borsh.struct([], "SplStake"),
    borsh.struct([], "KToken"),
    borsh.struct([], "PythEMA"),
    borsh.struct([], "MsolStake"),
    borsh.struct([], "KTokenToTokenA"),
    borsh.struct([], "KTokenToTokenB"),
    borsh.struct([], "JupiterLpFetch"),
    borsh.struct([], "ScopeTwap"),
    borsh.struct([], "OrcaWhirlpoolAtoB"),
    borsh.struct([], "OrcaWhirlpoolBtoA"),
    borsh.struct([], "RaydiumAmmV3AtoB"),
    borsh.struct([], "RaydiumAmmV3BtoA"),
    borsh.struct([], "JupiterLpCompute"),
    borsh.struct([], "MeteoraDlmmAtoB"),
    borsh.struct([], "MeteoraDlmmBtoA"),
    borsh.struct([], "JupiterLpScope"),
    borsh.struct([], "PythPullBased"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

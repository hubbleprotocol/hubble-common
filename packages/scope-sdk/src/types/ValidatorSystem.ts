import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface ValidatorSystemFields {
  validatorList: types.ListFields
  managerAuthority: PublicKey
  totalValidatorScore: number
  /** sum of all active lamports staked */
  totalActiveBalance: BN
  /** allow & auto-add validator when a user deposits a stake-account of a non-listed validator */
  autoAddValidatorEnabled: number
}

export interface ValidatorSystemJSON {
  validatorList: types.ListJSON
  managerAuthority: string
  totalValidatorScore: number
  /** sum of all active lamports staked */
  totalActiveBalance: string
  /** allow & auto-add validator when a user deposits a stake-account of a non-listed validator */
  autoAddValidatorEnabled: number
}

export class ValidatorSystem {
  readonly validatorList: types.List
  readonly managerAuthority: PublicKey
  readonly totalValidatorScore: number
  /** sum of all active lamports staked */
  readonly totalActiveBalance: BN
  /** allow & auto-add validator when a user deposits a stake-account of a non-listed validator */
  readonly autoAddValidatorEnabled: number

  constructor(fields: ValidatorSystemFields) {
    this.validatorList = new types.List({ ...fields.validatorList })
    this.managerAuthority = fields.managerAuthority
    this.totalValidatorScore = fields.totalValidatorScore
    this.totalActiveBalance = fields.totalActiveBalance
    this.autoAddValidatorEnabled = fields.autoAddValidatorEnabled
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.List.layout("validatorList"),
        borsh.publicKey("managerAuthority"),
        borsh.u32("totalValidatorScore"),
        borsh.u64("totalActiveBalance"),
        borsh.u8("autoAddValidatorEnabled"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new ValidatorSystem({
      validatorList: types.List.fromDecoded(obj.validatorList),
      managerAuthority: obj.managerAuthority,
      totalValidatorScore: obj.totalValidatorScore,
      totalActiveBalance: obj.totalActiveBalance,
      autoAddValidatorEnabled: obj.autoAddValidatorEnabled,
    })
  }

  static toEncodable(fields: ValidatorSystemFields) {
    return {
      validatorList: types.List.toEncodable(fields.validatorList),
      managerAuthority: fields.managerAuthority,
      totalValidatorScore: fields.totalValidatorScore,
      totalActiveBalance: fields.totalActiveBalance,
      autoAddValidatorEnabled: fields.autoAddValidatorEnabled,
    }
  }

  toJSON(): ValidatorSystemJSON {
    return {
      validatorList: this.validatorList.toJSON(),
      managerAuthority: this.managerAuthority.toString(),
      totalValidatorScore: this.totalValidatorScore,
      totalActiveBalance: this.totalActiveBalance.toString(),
      autoAddValidatorEnabled: this.autoAddValidatorEnabled,
    }
  }

  static fromJSON(obj: ValidatorSystemJSON): ValidatorSystem {
    return new ValidatorSystem({
      validatorList: types.List.fromJSON(obj.validatorList),
      managerAuthority: new PublicKey(obj.managerAuthority),
      totalValidatorScore: obj.totalValidatorScore,
      totalActiveBalance: new BN(obj.totalActiveBalance),
      autoAddValidatorEnabled: obj.autoAddValidatorEnabled,
    })
  }

  toEncodable() {
    return ValidatorSystem.toEncodable(this)
  }
}

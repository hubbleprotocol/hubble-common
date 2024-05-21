import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface StateFields {
  msolMint: PublicKey
  adminAuthority: PublicKey
  operationalSolAccount: PublicKey
  treasuryMsolAccount: PublicKey
  reserveBumpSeed: number
  msolMintAuthorityBumpSeed: number
  rentExemptForTokenAcc: BN
  rewardFee: types.FeeFields
  stakeSystem: types.StakeSystemFields
  validatorSystem: types.ValidatorSystemFields
  liqPool: types.LiqPoolFields
  availableReserveBalance: BN
  msolSupply: BN
  msolPrice: BN
  /** count tickets for delayed-unstake */
  circulatingTicketCount: BN
  /** total lamports amount of generated and not claimed yet tickets */
  circulatingTicketBalance: BN
  lentFromReserve: BN
  minDeposit: BN
  minWithdraw: BN
  stakingSolCap: BN
  emergencyCoolingDown: BN
}

export interface StateJSON {
  msolMint: string
  adminAuthority: string
  operationalSolAccount: string
  treasuryMsolAccount: string
  reserveBumpSeed: number
  msolMintAuthorityBumpSeed: number
  rentExemptForTokenAcc: string
  rewardFee: types.FeeJSON
  stakeSystem: types.StakeSystemJSON
  validatorSystem: types.ValidatorSystemJSON
  liqPool: types.LiqPoolJSON
  availableReserveBalance: string
  msolSupply: string
  msolPrice: string
  /** count tickets for delayed-unstake */
  circulatingTicketCount: string
  /** total lamports amount of generated and not claimed yet tickets */
  circulatingTicketBalance: string
  lentFromReserve: string
  minDeposit: string
  minWithdraw: string
  stakingSolCap: string
  emergencyCoolingDown: string
}

export class State {
  readonly msolMint: PublicKey
  readonly adminAuthority: PublicKey
  readonly operationalSolAccount: PublicKey
  readonly treasuryMsolAccount: PublicKey
  readonly reserveBumpSeed: number
  readonly msolMintAuthorityBumpSeed: number
  readonly rentExemptForTokenAcc: BN
  readonly rewardFee: types.Fee
  readonly stakeSystem: types.StakeSystem
  readonly validatorSystem: types.ValidatorSystem
  readonly liqPool: types.LiqPool
  readonly availableReserveBalance: BN
  readonly msolSupply: BN
  readonly msolPrice: BN
  /** count tickets for delayed-unstake */
  readonly circulatingTicketCount: BN
  /** total lamports amount of generated and not claimed yet tickets */
  readonly circulatingTicketBalance: BN
  readonly lentFromReserve: BN
  readonly minDeposit: BN
  readonly minWithdraw: BN
  readonly stakingSolCap: BN
  readonly emergencyCoolingDown: BN

  constructor(fields: StateFields) {
    this.msolMint = fields.msolMint
    this.adminAuthority = fields.adminAuthority
    this.operationalSolAccount = fields.operationalSolAccount
    this.treasuryMsolAccount = fields.treasuryMsolAccount
    this.reserveBumpSeed = fields.reserveBumpSeed
    this.msolMintAuthorityBumpSeed = fields.msolMintAuthorityBumpSeed
    this.rentExemptForTokenAcc = fields.rentExemptForTokenAcc
    this.rewardFee = new types.Fee({ ...fields.rewardFee })
    this.stakeSystem = new types.StakeSystem({ ...fields.stakeSystem })
    this.validatorSystem = new types.ValidatorSystem({
      ...fields.validatorSystem,
    })
    this.liqPool = new types.LiqPool({ ...fields.liqPool })
    this.availableReserveBalance = fields.availableReserveBalance
    this.msolSupply = fields.msolSupply
    this.msolPrice = fields.msolPrice
    this.circulatingTicketCount = fields.circulatingTicketCount
    this.circulatingTicketBalance = fields.circulatingTicketBalance
    this.lentFromReserve = fields.lentFromReserve
    this.minDeposit = fields.minDeposit
    this.minWithdraw = fields.minWithdraw
    this.stakingSolCap = fields.stakingSolCap
    this.emergencyCoolingDown = fields.emergencyCoolingDown
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.publicKey("msolMint"),
        borsh.publicKey("adminAuthority"),
        borsh.publicKey("operationalSolAccount"),
        borsh.publicKey("treasuryMsolAccount"),
        borsh.u8("reserveBumpSeed"),
        borsh.u8("msolMintAuthorityBumpSeed"),
        borsh.u64("rentExemptForTokenAcc"),
        types.Fee.layout("rewardFee"),
        types.StakeSystem.layout("stakeSystem"),
        types.ValidatorSystem.layout("validatorSystem"),
        types.LiqPool.layout("liqPool"),
        borsh.u64("availableReserveBalance"),
        borsh.u64("msolSupply"),
        borsh.u64("msolPrice"),
        borsh.u64("circulatingTicketCount"),
        borsh.u64("circulatingTicketBalance"),
        borsh.u64("lentFromReserve"),
        borsh.u64("minDeposit"),
        borsh.u64("minWithdraw"),
        borsh.u64("stakingSolCap"),
        borsh.u64("emergencyCoolingDown"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new State({
      msolMint: obj.msolMint,
      adminAuthority: obj.adminAuthority,
      operationalSolAccount: obj.operationalSolAccount,
      treasuryMsolAccount: obj.treasuryMsolAccount,
      reserveBumpSeed: obj.reserveBumpSeed,
      msolMintAuthorityBumpSeed: obj.msolMintAuthorityBumpSeed,
      rentExemptForTokenAcc: obj.rentExemptForTokenAcc,
      rewardFee: types.Fee.fromDecoded(obj.rewardFee),
      stakeSystem: types.StakeSystem.fromDecoded(obj.stakeSystem),
      validatorSystem: types.ValidatorSystem.fromDecoded(obj.validatorSystem),
      liqPool: types.LiqPool.fromDecoded(obj.liqPool),
      availableReserveBalance: obj.availableReserveBalance,
      msolSupply: obj.msolSupply,
      msolPrice: obj.msolPrice,
      circulatingTicketCount: obj.circulatingTicketCount,
      circulatingTicketBalance: obj.circulatingTicketBalance,
      lentFromReserve: obj.lentFromReserve,
      minDeposit: obj.minDeposit,
      minWithdraw: obj.minWithdraw,
      stakingSolCap: obj.stakingSolCap,
      emergencyCoolingDown: obj.emergencyCoolingDown,
    })
  }

  static toEncodable(fields: StateFields) {
    return {
      msolMint: fields.msolMint,
      adminAuthority: fields.adminAuthority,
      operationalSolAccount: fields.operationalSolAccount,
      treasuryMsolAccount: fields.treasuryMsolAccount,
      reserveBumpSeed: fields.reserveBumpSeed,
      msolMintAuthorityBumpSeed: fields.msolMintAuthorityBumpSeed,
      rentExemptForTokenAcc: fields.rentExemptForTokenAcc,
      rewardFee: types.Fee.toEncodable(fields.rewardFee),
      stakeSystem: types.StakeSystem.toEncodable(fields.stakeSystem),
      validatorSystem: types.ValidatorSystem.toEncodable(
        fields.validatorSystem
      ),
      liqPool: types.LiqPool.toEncodable(fields.liqPool),
      availableReserveBalance: fields.availableReserveBalance,
      msolSupply: fields.msolSupply,
      msolPrice: fields.msolPrice,
      circulatingTicketCount: fields.circulatingTicketCount,
      circulatingTicketBalance: fields.circulatingTicketBalance,
      lentFromReserve: fields.lentFromReserve,
      minDeposit: fields.minDeposit,
      minWithdraw: fields.minWithdraw,
      stakingSolCap: fields.stakingSolCap,
      emergencyCoolingDown: fields.emergencyCoolingDown,
    }
  }

  toJSON(): StateJSON {
    return {
      msolMint: this.msolMint.toString(),
      adminAuthority: this.adminAuthority.toString(),
      operationalSolAccount: this.operationalSolAccount.toString(),
      treasuryMsolAccount: this.treasuryMsolAccount.toString(),
      reserveBumpSeed: this.reserveBumpSeed,
      msolMintAuthorityBumpSeed: this.msolMintAuthorityBumpSeed,
      rentExemptForTokenAcc: this.rentExemptForTokenAcc.toString(),
      rewardFee: this.rewardFee.toJSON(),
      stakeSystem: this.stakeSystem.toJSON(),
      validatorSystem: this.validatorSystem.toJSON(),
      liqPool: this.liqPool.toJSON(),
      availableReserveBalance: this.availableReserveBalance.toString(),
      msolSupply: this.msolSupply.toString(),
      msolPrice: this.msolPrice.toString(),
      circulatingTicketCount: this.circulatingTicketCount.toString(),
      circulatingTicketBalance: this.circulatingTicketBalance.toString(),
      lentFromReserve: this.lentFromReserve.toString(),
      minDeposit: this.minDeposit.toString(),
      minWithdraw: this.minWithdraw.toString(),
      stakingSolCap: this.stakingSolCap.toString(),
      emergencyCoolingDown: this.emergencyCoolingDown.toString(),
    }
  }

  static fromJSON(obj: StateJSON): State {
    return new State({
      msolMint: new PublicKey(obj.msolMint),
      adminAuthority: new PublicKey(obj.adminAuthority),
      operationalSolAccount: new PublicKey(obj.operationalSolAccount),
      treasuryMsolAccount: new PublicKey(obj.treasuryMsolAccount),
      reserveBumpSeed: obj.reserveBumpSeed,
      msolMintAuthorityBumpSeed: obj.msolMintAuthorityBumpSeed,
      rentExemptForTokenAcc: new BN(obj.rentExemptForTokenAcc),
      rewardFee: types.Fee.fromJSON(obj.rewardFee),
      stakeSystem: types.StakeSystem.fromJSON(obj.stakeSystem),
      validatorSystem: types.ValidatorSystem.fromJSON(obj.validatorSystem),
      liqPool: types.LiqPool.fromJSON(obj.liqPool),
      availableReserveBalance: new BN(obj.availableReserveBalance),
      msolSupply: new BN(obj.msolSupply),
      msolPrice: new BN(obj.msolPrice),
      circulatingTicketCount: new BN(obj.circulatingTicketCount),
      circulatingTicketBalance: new BN(obj.circulatingTicketBalance),
      lentFromReserve: new BN(obj.lentFromReserve),
      minDeposit: new BN(obj.minDeposit),
      minWithdraw: new BN(obj.minWithdraw),
      stakingSolCap: new BN(obj.stakingSolCap),
      emergencyCoolingDown: new BN(obj.emergencyCoolingDown),
    })
  }

  toEncodable() {
    return State.toEncodable(this)
  }
}

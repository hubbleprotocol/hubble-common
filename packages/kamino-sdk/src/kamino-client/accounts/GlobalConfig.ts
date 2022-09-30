import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface GlobalConfigFields {
  emergencyMode: BN
  blockDeposit: BN
  blockInvest: BN
  blockWithdraw: BN
  blockCollectFees: BN
  blockCollectRewards: BN
  blockSwapRewards: BN
  blockSwapUnevenVaults: BN
  feesBps: BN
  scopeProgramId: PublicKey
  scopePriceId: PublicKey
  swapRewardsDiscountBps: Array<BN>
  actionsAuthority: PublicKey
  adminAuthority: PublicKey
  treasuryFeeVaults: Array<PublicKey>
  padding: Array<BN>
}

export interface GlobalConfigJSON {
  emergencyMode: string
  blockDeposit: string
  blockInvest: string
  blockWithdraw: string
  blockCollectFees: string
  blockCollectRewards: string
  blockSwapRewards: string
  blockSwapUnevenVaults: string
  feesBps: string
  scopeProgramId: string
  scopePriceId: string
  swapRewardsDiscountBps: Array<string>
  actionsAuthority: string
  adminAuthority: string
  treasuryFeeVaults: Array<string>
  padding: Array<string>
}

export class GlobalConfig {
  readonly emergencyMode: BN
  readonly blockDeposit: BN
  readonly blockInvest: BN
  readonly blockWithdraw: BN
  readonly blockCollectFees: BN
  readonly blockCollectRewards: BN
  readonly blockSwapRewards: BN
  readonly blockSwapUnevenVaults: BN
  readonly feesBps: BN
  readonly scopeProgramId: PublicKey
  readonly scopePriceId: PublicKey
  readonly swapRewardsDiscountBps: Array<BN>
  readonly actionsAuthority: PublicKey
  readonly adminAuthority: PublicKey
  readonly treasuryFeeVaults: Array<PublicKey>
  readonly padding: Array<BN>

  static readonly discriminator = Buffer.from([
    149, 8, 156, 202, 160, 252, 176, 217,
  ])

  static readonly layout = borsh.struct([
    borsh.u64("emergencyMode"),
    borsh.u64("blockDeposit"),
    borsh.u64("blockInvest"),
    borsh.u64("blockWithdraw"),
    borsh.u64("blockCollectFees"),
    borsh.u64("blockCollectRewards"),
    borsh.u64("blockSwapRewards"),
    borsh.u64("blockSwapUnevenVaults"),
    borsh.u64("feesBps"),
    borsh.publicKey("scopeProgramId"),
    borsh.publicKey("scopePriceId"),
    borsh.array(borsh.u64(), 256, "swapRewardsDiscountBps"),
    borsh.publicKey("actionsAuthority"),
    borsh.publicKey("adminAuthority"),
    borsh.array(borsh.publicKey(), 256, "treasuryFeeVaults"),
    borsh.array(borsh.u64(), 2048, "padding"),
  ])

  constructor(fields: GlobalConfigFields) {
    this.emergencyMode = fields.emergencyMode
    this.blockDeposit = fields.blockDeposit
    this.blockInvest = fields.blockInvest
    this.blockWithdraw = fields.blockWithdraw
    this.blockCollectFees = fields.blockCollectFees
    this.blockCollectRewards = fields.blockCollectRewards
    this.blockSwapRewards = fields.blockSwapRewards
    this.blockSwapUnevenVaults = fields.blockSwapUnevenVaults
    this.feesBps = fields.feesBps
    this.scopeProgramId = fields.scopeProgramId
    this.scopePriceId = fields.scopePriceId
    this.swapRewardsDiscountBps = fields.swapRewardsDiscountBps
    this.actionsAuthority = fields.actionsAuthority
    this.adminAuthority = fields.adminAuthority
    this.treasuryFeeVaults = fields.treasuryFeeVaults
    this.padding = fields.padding
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<GlobalConfig | null> {
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
  ): Promise<Array<GlobalConfig | null>> {
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

  static decode(data: Buffer): GlobalConfig {
    if (!data.slice(0, 8).equals(GlobalConfig.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = GlobalConfig.layout.decode(data.slice(8))

    return new GlobalConfig({
      emergencyMode: dec.emergencyMode,
      blockDeposit: dec.blockDeposit,
      blockInvest: dec.blockInvest,
      blockWithdraw: dec.blockWithdraw,
      blockCollectFees: dec.blockCollectFees,
      blockCollectRewards: dec.blockCollectRewards,
      blockSwapRewards: dec.blockSwapRewards,
      blockSwapUnevenVaults: dec.blockSwapUnevenVaults,
      feesBps: dec.feesBps,
      scopeProgramId: dec.scopeProgramId,
      scopePriceId: dec.scopePriceId,
      swapRewardsDiscountBps: dec.swapRewardsDiscountBps,
      actionsAuthority: dec.actionsAuthority,
      adminAuthority: dec.adminAuthority,
      treasuryFeeVaults: dec.treasuryFeeVaults,
      padding: dec.padding,
    })
  }

  toJSON(): GlobalConfigJSON {
    return {
      emergencyMode: this.emergencyMode.toString(),
      blockDeposit: this.blockDeposit.toString(),
      blockInvest: this.blockInvest.toString(),
      blockWithdraw: this.blockWithdraw.toString(),
      blockCollectFees: this.blockCollectFees.toString(),
      blockCollectRewards: this.blockCollectRewards.toString(),
      blockSwapRewards: this.blockSwapRewards.toString(),
      blockSwapUnevenVaults: this.blockSwapUnevenVaults.toString(),
      feesBps: this.feesBps.toString(),
      scopeProgramId: this.scopeProgramId.toString(),
      scopePriceId: this.scopePriceId.toString(),
      swapRewardsDiscountBps: this.swapRewardsDiscountBps.map((item) =>
        item.toString()
      ),
      actionsAuthority: this.actionsAuthority.toString(),
      adminAuthority: this.adminAuthority.toString(),
      treasuryFeeVaults: this.treasuryFeeVaults.map((item) => item.toString()),
      padding: this.padding.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: GlobalConfigJSON): GlobalConfig {
    return new GlobalConfig({
      emergencyMode: new BN(obj.emergencyMode),
      blockDeposit: new BN(obj.blockDeposit),
      blockInvest: new BN(obj.blockInvest),
      blockWithdraw: new BN(obj.blockWithdraw),
      blockCollectFees: new BN(obj.blockCollectFees),
      blockCollectRewards: new BN(obj.blockCollectRewards),
      blockSwapRewards: new BN(obj.blockSwapRewards),
      blockSwapUnevenVaults: new BN(obj.blockSwapUnevenVaults),
      feesBps: new BN(obj.feesBps),
      scopeProgramId: new PublicKey(obj.scopeProgramId),
      scopePriceId: new PublicKey(obj.scopePriceId),
      swapRewardsDiscountBps: obj.swapRewardsDiscountBps.map(
        (item) => new BN(item)
      ),
      actionsAuthority: new PublicKey(obj.actionsAuthority),
      adminAuthority: new PublicKey(obj.adminAuthority),
      treasuryFeeVaults: obj.treasuryFeeVaults.map(
        (item) => new PublicKey(item)
      ),
      padding: obj.padding.map((item) => new BN(item)),
    })
  }
}

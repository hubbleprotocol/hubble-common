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
  padding1: Array<BN>
  padding2: Array<BN>
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
  padding1: Array<string>
  padding2: Array<string>
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
  readonly padding1: Array<BN>
  readonly padding2: Array<BN>

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
    borsh.array(borsh.u64(), 128, "swapRewardsDiscountBps"),
    borsh.array(borsh.u64(), 65, "padding1"),
    borsh.array(borsh.u64(), 20, "padding2"),
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
    this.padding1 = fields.padding1
    this.padding2 = fields.padding2
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
      padding1: dec.padding1,
      padding2: dec.padding2,
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
      padding1: this.padding1.map((item) => item.toString()),
      padding2: this.padding2.map((item) => item.toString()),
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
      padding1: obj.padding1.map((item) => new BN(item)),
      padding2: obj.padding2.map((item) => new BN(item)),
    })
  }
}

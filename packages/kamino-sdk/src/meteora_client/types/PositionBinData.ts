import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface PositionBinDataFields {
  liquidityShare: BN
  rewardInfo: types.UserRewardInfoFields
  feeInfo: types.FeeInfoFields
}

export interface PositionBinDataJSON {
  liquidityShare: string
  rewardInfo: types.UserRewardInfoJSON
  feeInfo: types.FeeInfoJSON
}

export class PositionBinData {
  readonly liquidityShare: BN
  readonly rewardInfo: types.UserRewardInfo
  readonly feeInfo: types.FeeInfo

  constructor(fields: PositionBinDataFields) {
    this.liquidityShare = fields.liquidityShare
    this.rewardInfo = new types.UserRewardInfo({ ...fields.rewardInfo })
    this.feeInfo = new types.FeeInfo({ ...fields.feeInfo })
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u128("liquidityShare"),
        types.UserRewardInfo.layout("rewardInfo"),
        types.FeeInfo.layout("feeInfo"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new PositionBinData({
      liquidityShare: obj.liquidityShare,
      rewardInfo: types.UserRewardInfo.fromDecoded(obj.rewardInfo),
      feeInfo: types.FeeInfo.fromDecoded(obj.feeInfo),
    })
  }

  static toEncodable(fields: PositionBinDataFields) {
    return {
      liquidityShare: fields.liquidityShare,
      rewardInfo: types.UserRewardInfo.toEncodable(fields.rewardInfo),
      feeInfo: types.FeeInfo.toEncodable(fields.feeInfo),
    }
  }

  toJSON(): PositionBinDataJSON {
    return {
      liquidityShare: this.liquidityShare.toString(),
      rewardInfo: this.rewardInfo.toJSON(),
      feeInfo: this.feeInfo.toJSON(),
    }
  }

  static fromJSON(obj: PositionBinDataJSON): PositionBinData {
    return new PositionBinData({
      liquidityShare: new BN(obj.liquidityShare),
      rewardInfo: types.UserRewardInfo.fromJSON(obj.rewardInfo),
      feeInfo: types.FeeInfo.fromJSON(obj.feeInfo),
    })
  }

  toEncodable() {
    return PositionBinData.toEncodable(this)
  }
}

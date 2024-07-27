import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface UserRewardInfoFields {
  rewardPerTokenCompletes: Array<BN>
  rewardPendings: Array<BN>
}

export interface UserRewardInfoJSON {
  rewardPerTokenCompletes: Array<string>
  rewardPendings: Array<string>
}

export class UserRewardInfo {
  readonly rewardPerTokenCompletes: Array<BN>
  readonly rewardPendings: Array<BN>

  constructor(fields: UserRewardInfoFields) {
    this.rewardPerTokenCompletes = fields.rewardPerTokenCompletes
    this.rewardPendings = fields.rewardPendings
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.array(borsh.u128(), 2, "rewardPerTokenCompletes"),
        borsh.array(borsh.u64(), 2, "rewardPendings"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new UserRewardInfo({
      rewardPerTokenCompletes: obj.rewardPerTokenCompletes,
      rewardPendings: obj.rewardPendings,
    })
  }

  static toEncodable(fields: UserRewardInfoFields) {
    return {
      rewardPerTokenCompletes: fields.rewardPerTokenCompletes,
      rewardPendings: fields.rewardPendings,
    }
  }

  toJSON(): UserRewardInfoJSON {
    return {
      rewardPerTokenCompletes: this.rewardPerTokenCompletes.map((item) =>
        item.toString()
      ),
      rewardPendings: this.rewardPendings.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: UserRewardInfoJSON): UserRewardInfo {
    return new UserRewardInfo({
      rewardPerTokenCompletes: obj.rewardPerTokenCompletes.map(
        (item) => new BN(item)
      ),
      rewardPendings: obj.rewardPendings.map((item) => new BN(item)),
    })
  }

  toEncodable() {
    return UserRewardInfo.toEncodable(this)
  }
}

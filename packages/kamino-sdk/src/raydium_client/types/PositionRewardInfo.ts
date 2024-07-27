import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh';

export interface PositionRewardInfoFields {
  growthInsideLastX64: BN;
  rewardAmountOwed: BN;
}

export interface PositionRewardInfoJSON {
  growthInsideLastX64: string;
  rewardAmountOwed: string;
}

export class PositionRewardInfo {
  readonly growthInsideLastX64: BN;
  readonly rewardAmountOwed: BN;

  constructor(fields: PositionRewardInfoFields) {
    this.growthInsideLastX64 = fields.growthInsideLastX64;
    this.rewardAmountOwed = fields.rewardAmountOwed;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u128('growthInsideLastX64'), borsh.u64('rewardAmountOwed')], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new PositionRewardInfo({
      growthInsideLastX64: obj.growthInsideLastX64,
      rewardAmountOwed: obj.rewardAmountOwed,
    });
  }

  static toEncodable(fields: PositionRewardInfoFields) {
    return {
      growthInsideLastX64: fields.growthInsideLastX64,
      rewardAmountOwed: fields.rewardAmountOwed,
    };
  }

  toJSON(): PositionRewardInfoJSON {
    return {
      growthInsideLastX64: this.growthInsideLastX64.toString(),
      rewardAmountOwed: this.rewardAmountOwed.toString(),
    };
  }

  static fromJSON(obj: PositionRewardInfoJSON): PositionRewardInfo {
    return new PositionRewardInfo({
      growthInsideLastX64: new BN(obj.growthInsideLastX64),
      rewardAmountOwed: new BN(obj.rewardAmountOwed),
    });
  }

  toEncodable() {
    return PositionRewardInfo.toEncodable(this);
  }
}

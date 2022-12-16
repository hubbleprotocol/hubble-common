import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '.'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh';

export interface InitializeRewardParamFields {
  /** Reward open time */
  openTime: BN;
  /** Reward end time */
  endTime: BN;
  /** Token reward per second are earned per unit of liquidity */
  emissionsPerSecondX64: BN;
}

export interface InitializeRewardParamJSON {
  /** Reward open time */
  openTime: string;
  /** Reward end time */
  endTime: string;
  /** Token reward per second are earned per unit of liquidity */
  emissionsPerSecondX64: string;
}

export class InitializeRewardParam {
  /** Reward open time */
  readonly openTime: BN;
  /** Reward end time */
  readonly endTime: BN;
  /** Token reward per second are earned per unit of liquidity */
  readonly emissionsPerSecondX64: BN;

  constructor(fields: InitializeRewardParamFields) {
    this.openTime = fields.openTime;
    this.endTime = fields.endTime;
    this.emissionsPerSecondX64 = fields.emissionsPerSecondX64;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u64('openTime'), borsh.u64('endTime'), borsh.u128('emissionsPerSecondX64')], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new InitializeRewardParam({
      openTime: obj.openTime,
      endTime: obj.endTime,
      emissionsPerSecondX64: obj.emissionsPerSecondX64,
    });
  }

  static toEncodable(fields: InitializeRewardParamFields) {
    return {
      openTime: fields.openTime,
      endTime: fields.endTime,
      emissionsPerSecondX64: fields.emissionsPerSecondX64,
    };
  }

  toJSON(): InitializeRewardParamJSON {
    return {
      openTime: this.openTime.toString(),
      endTime: this.endTime.toString(),
      emissionsPerSecondX64: this.emissionsPerSecondX64.toString(),
    };
  }

  static fromJSON(obj: InitializeRewardParamJSON): InitializeRewardParam {
    return new InitializeRewardParam({
      openTime: new BN(obj.openTime),
      endTime: new BN(obj.endTime),
      emissionsPerSecondX64: new BN(obj.emissionsPerSecondX64),
    });
  }

  toEncodable() {
    return InitializeRewardParam.toEncodable(this);
  }
}

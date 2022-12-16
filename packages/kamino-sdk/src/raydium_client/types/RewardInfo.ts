import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '.'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh';

export interface RewardInfoFields {
  /** Reward state */
  rewardState: number;
  /** Reward open time */
  openTime: BN;
  /** Reward end time */
  endTime: BN;
  /** Reward last update time */
  lastUpdateTime: BN;
  /** Q64.64 number indicates how many tokens per second are earned per unit of liquidity. */
  emissionsPerSecondX64: BN;
  /** The total amount of reward emissioned */
  rewardTotalEmissioned: BN;
  /** The total amount of claimed reward */
  rewardClaimed: BN;
  /** Reward token mint. */
  tokenMint: PublicKey;
  /** Reward vault token account. */
  tokenVault: PublicKey;
  /** The owner that has permission to set reward param */
  authority: PublicKey;
  /**
   * Q64.64 number that tracks the total tokens earned per unit of liquidity since the reward
   * emissions were turned on.
   */
  rewardGrowthGlobalX64: BN;
}

export interface RewardInfoJSON {
  /** Reward state */
  rewardState: number;
  /** Reward open time */
  openTime: string;
  /** Reward end time */
  endTime: string;
  /** Reward last update time */
  lastUpdateTime: string;
  /** Q64.64 number indicates how many tokens per second are earned per unit of liquidity. */
  emissionsPerSecondX64: string;
  /** The total amount of reward emissioned */
  rewardTotalEmissioned: string;
  /** The total amount of claimed reward */
  rewardClaimed: string;
  /** Reward token mint. */
  tokenMint: string;
  /** Reward vault token account. */
  tokenVault: string;
  /** The owner that has permission to set reward param */
  authority: string;
  /**
   * Q64.64 number that tracks the total tokens earned per unit of liquidity since the reward
   * emissions were turned on.
   */
  rewardGrowthGlobalX64: string;
}

export class RewardInfo {
  /** Reward state */
  readonly rewardState: number;
  /** Reward open time */
  readonly openTime: BN;
  /** Reward end time */
  readonly endTime: BN;
  /** Reward last update time */
  readonly lastUpdateTime: BN;
  /** Q64.64 number indicates how many tokens per second are earned per unit of liquidity. */
  readonly emissionsPerSecondX64: BN;
  /** The total amount of reward emissioned */
  readonly rewardTotalEmissioned: BN;
  /** The total amount of claimed reward */
  readonly rewardClaimed: BN;
  /** Reward token mint. */
  readonly tokenMint: PublicKey;
  /** Reward vault token account. */
  readonly tokenVault: PublicKey;
  /** The owner that has permission to set reward param */
  readonly authority: PublicKey;
  /**
   * Q64.64 number that tracks the total tokens earned per unit of liquidity since the reward
   * emissions were turned on.
   */
  readonly rewardGrowthGlobalX64: BN;

  constructor(fields: RewardInfoFields) {
    this.rewardState = fields.rewardState;
    this.openTime = fields.openTime;
    this.endTime = fields.endTime;
    this.lastUpdateTime = fields.lastUpdateTime;
    this.emissionsPerSecondX64 = fields.emissionsPerSecondX64;
    this.rewardTotalEmissioned = fields.rewardTotalEmissioned;
    this.rewardClaimed = fields.rewardClaimed;
    this.tokenMint = fields.tokenMint;
    this.tokenVault = fields.tokenVault;
    this.authority = fields.authority;
    this.rewardGrowthGlobalX64 = fields.rewardGrowthGlobalX64;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u8('rewardState'),
        borsh.u64('openTime'),
        borsh.u64('endTime'),
        borsh.u64('lastUpdateTime'),
        borsh.u128('emissionsPerSecondX64'),
        borsh.u64('rewardTotalEmissioned'),
        borsh.u64('rewardClaimed'),
        borsh.publicKey('tokenMint'),
        borsh.publicKey('tokenVault'),
        borsh.publicKey('authority'),
        borsh.u128('rewardGrowthGlobalX64'),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new RewardInfo({
      rewardState: obj.rewardState,
      openTime: obj.openTime,
      endTime: obj.endTime,
      lastUpdateTime: obj.lastUpdateTime,
      emissionsPerSecondX64: obj.emissionsPerSecondX64,
      rewardTotalEmissioned: obj.rewardTotalEmissioned,
      rewardClaimed: obj.rewardClaimed,
      tokenMint: obj.tokenMint,
      tokenVault: obj.tokenVault,
      authority: obj.authority,
      rewardGrowthGlobalX64: obj.rewardGrowthGlobalX64,
    });
  }

  static toEncodable(fields: RewardInfoFields) {
    return {
      rewardState: fields.rewardState,
      openTime: fields.openTime,
      endTime: fields.endTime,
      lastUpdateTime: fields.lastUpdateTime,
      emissionsPerSecondX64: fields.emissionsPerSecondX64,
      rewardTotalEmissioned: fields.rewardTotalEmissioned,
      rewardClaimed: fields.rewardClaimed,
      tokenMint: fields.tokenMint,
      tokenVault: fields.tokenVault,
      authority: fields.authority,
      rewardGrowthGlobalX64: fields.rewardGrowthGlobalX64,
    };
  }

  toJSON(): RewardInfoJSON {
    return {
      rewardState: this.rewardState,
      openTime: this.openTime.toString(),
      endTime: this.endTime.toString(),
      lastUpdateTime: this.lastUpdateTime.toString(),
      emissionsPerSecondX64: this.emissionsPerSecondX64.toString(),
      rewardTotalEmissioned: this.rewardTotalEmissioned.toString(),
      rewardClaimed: this.rewardClaimed.toString(),
      tokenMint: this.tokenMint.toString(),
      tokenVault: this.tokenVault.toString(),
      authority: this.authority.toString(),
      rewardGrowthGlobalX64: this.rewardGrowthGlobalX64.toString(),
    };
  }

  static fromJSON(obj: RewardInfoJSON): RewardInfo {
    return new RewardInfo({
      rewardState: obj.rewardState,
      openTime: new BN(obj.openTime),
      endTime: new BN(obj.endTime),
      lastUpdateTime: new BN(obj.lastUpdateTime),
      emissionsPerSecondX64: new BN(obj.emissionsPerSecondX64),
      rewardTotalEmissioned: new BN(obj.rewardTotalEmissioned),
      rewardClaimed: new BN(obj.rewardClaimed),
      tokenMint: new PublicKey(obj.tokenMint),
      tokenVault: new PublicKey(obj.tokenVault),
      authority: new PublicKey(obj.authority),
      rewardGrowthGlobalX64: new BN(obj.rewardGrowthGlobalX64),
    });
  }

  toEncodable() {
    return RewardInfo.toEncodable(this);
  }
}

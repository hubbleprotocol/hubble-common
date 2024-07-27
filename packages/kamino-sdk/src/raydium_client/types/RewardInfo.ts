import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh';

export interface RewardInfoFields {
  rewardState: number;
  openTime: BN;
  endTime: BN;
  lastUpdateTime: BN;
  emissionsPerSecondX64: BN;
  rewardTotalEmissioned: BN;
  rewardClaimed: BN;
  tokenMint: PublicKey;
  tokenVault: PublicKey;
  authority: PublicKey;
  rewardGrowthGlobalX64: BN;
}

export interface RewardInfoJSON {
  rewardState: number;
  openTime: string;
  endTime: string;
  lastUpdateTime: string;
  emissionsPerSecondX64: string;
  rewardTotalEmissioned: string;
  rewardClaimed: string;
  tokenMint: string;
  tokenVault: string;
  authority: string;
  rewardGrowthGlobalX64: string;
}

export class RewardInfo {
  readonly rewardState: number;
  readonly openTime: BN;
  readonly endTime: BN;
  readonly lastUpdateTime: BN;
  readonly emissionsPerSecondX64: BN;
  readonly rewardTotalEmissioned: BN;
  readonly rewardClaimed: BN;
  readonly tokenMint: PublicKey;
  readonly tokenVault: PublicKey;
  readonly authority: PublicKey;
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

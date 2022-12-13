import { PublicKey, Connection } from '@solana/web3.js';
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface WhirlpoolFields {
  whirlpoolsConfig: PublicKey;
  whirlpoolBump: Array<number>;
  tickSpacing: number;
  tickSpacingSeed: Array<number>;
  feeRate: number;
  protocolFeeRate: number;
  liquidity: BN;
  sqrtPrice: BN;
  tickCurrentIndex: number;
  protocolFeeOwedA: BN;
  protocolFeeOwedB: BN;
  tokenMintA: PublicKey;
  tokenVaultA: PublicKey;
  feeGrowthGlobalA: BN;
  tokenMintB: PublicKey;
  tokenVaultB: PublicKey;
  feeGrowthGlobalB: BN;
  rewardLastUpdatedTimestamp: BN;
  rewardInfos: Array<types.WhirlpoolRewardInfoFields>;
}

export interface WhirlpoolJSON {
  whirlpoolsConfig: string;
  whirlpoolBump: Array<number>;
  tickSpacing: number;
  tickSpacingSeed: Array<number>;
  feeRate: number;
  protocolFeeRate: number;
  liquidity: string;
  sqrtPrice: string;
  tickCurrentIndex: number;
  protocolFeeOwedA: string;
  protocolFeeOwedB: string;
  tokenMintA: string;
  tokenVaultA: string;
  feeGrowthGlobalA: string;
  tokenMintB: string;
  tokenVaultB: string;
  feeGrowthGlobalB: string;
  rewardLastUpdatedTimestamp: string;
  rewardInfos: Array<types.WhirlpoolRewardInfoJSON>;
}

/** External types */
export class Whirlpool {
  readonly whirlpoolsConfig: PublicKey;
  readonly whirlpoolBump: Array<number>;
  readonly tickSpacing: number;
  readonly tickSpacingSeed: Array<number>;
  readonly feeRate: number;
  readonly protocolFeeRate: number;
  readonly liquidity: BN;
  readonly sqrtPrice: BN;
  readonly tickCurrentIndex: number;
  readonly protocolFeeOwedA: BN;
  readonly protocolFeeOwedB: BN;
  readonly tokenMintA: PublicKey;
  readonly tokenVaultA: PublicKey;
  readonly feeGrowthGlobalA: BN;
  readonly tokenMintB: PublicKey;
  readonly tokenVaultB: PublicKey;
  readonly feeGrowthGlobalB: BN;
  readonly rewardLastUpdatedTimestamp: BN;
  readonly rewardInfos: Array<types.WhirlpoolRewardInfo>;

  static readonly discriminator = Buffer.from([63, 149, 209, 12, 225, 128, 99, 9]);

  static readonly layout = borsh.struct([
    borsh.publicKey('whirlpoolsConfig'),
    borsh.array(borsh.u8(), 1, 'whirlpoolBump'),
    borsh.u16('tickSpacing'),
    borsh.array(borsh.u8(), 2, 'tickSpacingSeed'),
    borsh.u16('feeRate'),
    borsh.u16('protocolFeeRate'),
    borsh.u128('liquidity'),
    borsh.u128('sqrtPrice'),
    borsh.i32('tickCurrentIndex'),
    borsh.u64('protocolFeeOwedA'),
    borsh.u64('protocolFeeOwedB'),
    borsh.publicKey('tokenMintA'),
    borsh.publicKey('tokenVaultA'),
    borsh.u128('feeGrowthGlobalA'),
    borsh.publicKey('tokenMintB'),
    borsh.publicKey('tokenVaultB'),
    borsh.u128('feeGrowthGlobalB'),
    borsh.u64('rewardLastUpdatedTimestamp'),
    borsh.array(types.WhirlpoolRewardInfo.layout(), 3, 'rewardInfos'),
  ]);

  constructor(fields: WhirlpoolFields) {
    this.whirlpoolsConfig = fields.whirlpoolsConfig;
    this.whirlpoolBump = fields.whirlpoolBump;
    this.tickSpacing = fields.tickSpacing;
    this.tickSpacingSeed = fields.tickSpacingSeed;
    this.feeRate = fields.feeRate;
    this.protocolFeeRate = fields.protocolFeeRate;
    this.liquidity = fields.liquidity;
    this.sqrtPrice = fields.sqrtPrice;
    this.tickCurrentIndex = fields.tickCurrentIndex;
    this.protocolFeeOwedA = fields.protocolFeeOwedA;
    this.protocolFeeOwedB = fields.protocolFeeOwedB;
    this.tokenMintA = fields.tokenMintA;
    this.tokenVaultA = fields.tokenVaultA;
    this.feeGrowthGlobalA = fields.feeGrowthGlobalA;
    this.tokenMintB = fields.tokenMintB;
    this.tokenVaultB = fields.tokenVaultB;
    this.feeGrowthGlobalB = fields.feeGrowthGlobalB;
    this.rewardLastUpdatedTimestamp = fields.rewardLastUpdatedTimestamp;
    this.rewardInfos = fields.rewardInfos.map((item) => new types.WhirlpoolRewardInfo({ ...item }));
  }

  static async fetch(c: Connection, address: PublicKey): Promise<Whirlpool | null> {
    const info = await c.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(c: Connection, addresses: PublicKey[]): Promise<Array<Whirlpool | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses);

    return infos.map((info) => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): Whirlpool {
    if (!data.slice(0, 8).equals(Whirlpool.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = Whirlpool.layout.decode(data.slice(8));

    return new Whirlpool({
      whirlpoolsConfig: dec.whirlpoolsConfig,
      whirlpoolBump: dec.whirlpoolBump,
      tickSpacing: dec.tickSpacing,
      tickSpacingSeed: dec.tickSpacingSeed,
      feeRate: dec.feeRate,
      protocolFeeRate: dec.protocolFeeRate,
      liquidity: dec.liquidity,
      sqrtPrice: dec.sqrtPrice,
      tickCurrentIndex: dec.tickCurrentIndex,
      protocolFeeOwedA: dec.protocolFeeOwedA,
      protocolFeeOwedB: dec.protocolFeeOwedB,
      tokenMintA: dec.tokenMintA,
      tokenVaultA: dec.tokenVaultA,
      feeGrowthGlobalA: dec.feeGrowthGlobalA,
      tokenMintB: dec.tokenMintB,
      tokenVaultB: dec.tokenVaultB,
      feeGrowthGlobalB: dec.feeGrowthGlobalB,
      rewardLastUpdatedTimestamp: dec.rewardLastUpdatedTimestamp,
      rewardInfos: dec.rewardInfos.map((item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>
        types.WhirlpoolRewardInfo.fromDecoded(item)
      ),
    });
  }

  toJSON(): WhirlpoolJSON {
    return {
      whirlpoolsConfig: this.whirlpoolsConfig.toString(),
      whirlpoolBump: this.whirlpoolBump,
      tickSpacing: this.tickSpacing,
      tickSpacingSeed: this.tickSpacingSeed,
      feeRate: this.feeRate,
      protocolFeeRate: this.protocolFeeRate,
      liquidity: this.liquidity.toString(),
      sqrtPrice: this.sqrtPrice.toString(),
      tickCurrentIndex: this.tickCurrentIndex,
      protocolFeeOwedA: this.protocolFeeOwedA.toString(),
      protocolFeeOwedB: this.protocolFeeOwedB.toString(),
      tokenMintA: this.tokenMintA.toString(),
      tokenVaultA: this.tokenVaultA.toString(),
      feeGrowthGlobalA: this.feeGrowthGlobalA.toString(),
      tokenMintB: this.tokenMintB.toString(),
      tokenVaultB: this.tokenVaultB.toString(),
      feeGrowthGlobalB: this.feeGrowthGlobalB.toString(),
      rewardLastUpdatedTimestamp: this.rewardLastUpdatedTimestamp.toString(),
      rewardInfos: this.rewardInfos.map((item) => item.toJSON()),
    };
  }

  static fromJSON(obj: WhirlpoolJSON): Whirlpool {
    return new Whirlpool({
      whirlpoolsConfig: new PublicKey(obj.whirlpoolsConfig),
      whirlpoolBump: obj.whirlpoolBump,
      tickSpacing: obj.tickSpacing,
      tickSpacingSeed: obj.tickSpacingSeed,
      feeRate: obj.feeRate,
      protocolFeeRate: obj.protocolFeeRate,
      liquidity: new BN(obj.liquidity),
      sqrtPrice: new BN(obj.sqrtPrice),
      tickCurrentIndex: obj.tickCurrentIndex,
      protocolFeeOwedA: new BN(obj.protocolFeeOwedA),
      protocolFeeOwedB: new BN(obj.protocolFeeOwedB),
      tokenMintA: new PublicKey(obj.tokenMintA),
      tokenVaultA: new PublicKey(obj.tokenVaultA),
      feeGrowthGlobalA: new BN(obj.feeGrowthGlobalA),
      tokenMintB: new PublicKey(obj.tokenMintB),
      tokenVaultB: new PublicKey(obj.tokenVaultB),
      feeGrowthGlobalB: new BN(obj.feeGrowthGlobalB),
      rewardLastUpdatedTimestamp: new BN(obj.rewardLastUpdatedTimestamp),
      rewardInfos: obj.rewardInfos.map((item) => types.WhirlpoolRewardInfo.fromJSON(item)),
    });
  }
}

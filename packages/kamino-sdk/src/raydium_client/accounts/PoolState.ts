import { PublicKey, Connection } from '@solana/web3.js';
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface PoolStateFields {
  bump: Array<number>;
  ammConfig: PublicKey;
  owner: PublicKey;
  tokenMint0: PublicKey;
  tokenMint1: PublicKey;
  tokenVault0: PublicKey;
  tokenVault1: PublicKey;
  observationKey: PublicKey;
  mintDecimals0: number;
  mintDecimals1: number;
  tickSpacing: number;
  liquidity: BN;
  sqrtPriceX64: BN;
  tickCurrent: number;
  observationIndex: number;
  observationUpdateDuration: number;
  feeGrowthGlobal0X64: BN;
  feeGrowthGlobal1X64: BN;
  protocolFeesToken0: BN;
  protocolFeesToken1: BN;
  swapInAmountToken0: BN;
  swapOutAmountToken1: BN;
  swapInAmountToken1: BN;
  swapOutAmountToken0: BN;
  status: number;
  padding: Array<number>;
  rewardInfos: Array<types.RewardInfoFields>;
  tickArrayBitmap: Array<BN>;
  totalFeesToken0: BN;
  totalFeesClaimedToken0: BN;
  totalFeesToken1: BN;
  totalFeesClaimedToken1: BN;
  fundFeesToken0: BN;
  fundFeesToken1: BN;
  openTime: BN;
  padding1: Array<BN>;
  padding2: Array<BN>;
}

export interface PoolStateJSON {
  bump: Array<number>;
  ammConfig: string;
  owner: string;
  tokenMint0: string;
  tokenMint1: string;
  tokenVault0: string;
  tokenVault1: string;
  observationKey: string;
  mintDecimals0: number;
  mintDecimals1: number;
  tickSpacing: number;
  liquidity: string;
  sqrtPriceX64: string;
  tickCurrent: number;
  observationIndex: number;
  observationUpdateDuration: number;
  feeGrowthGlobal0X64: string;
  feeGrowthGlobal1X64: string;
  protocolFeesToken0: string;
  protocolFeesToken1: string;
  swapInAmountToken0: string;
  swapOutAmountToken1: string;
  swapInAmountToken1: string;
  swapOutAmountToken0: string;
  status: number;
  padding: Array<number>;
  rewardInfos: Array<types.RewardInfoJSON>;
  tickArrayBitmap: Array<string>;
  totalFeesToken0: string;
  totalFeesClaimedToken0: string;
  totalFeesToken1: string;
  totalFeesClaimedToken1: string;
  fundFeesToken0: string;
  fundFeesToken1: string;
  openTime: string;
  padding1: Array<string>;
  padding2: Array<string>;
}

export class PoolState {
  readonly bump: Array<number>;
  readonly ammConfig: PublicKey;
  readonly owner: PublicKey;
  readonly tokenMint0: PublicKey;
  readonly tokenMint1: PublicKey;
  readonly tokenVault0: PublicKey;
  readonly tokenVault1: PublicKey;
  readonly observationKey: PublicKey;
  readonly mintDecimals0: number;
  readonly mintDecimals1: number;
  readonly tickSpacing: number;
  readonly liquidity: BN;
  readonly sqrtPriceX64: BN;
  readonly tickCurrent: number;
  readonly observationIndex: number;
  readonly observationUpdateDuration: number;
  readonly feeGrowthGlobal0X64: BN;
  readonly feeGrowthGlobal1X64: BN;
  readonly protocolFeesToken0: BN;
  readonly protocolFeesToken1: BN;
  readonly swapInAmountToken0: BN;
  readonly swapOutAmountToken1: BN;
  readonly swapInAmountToken1: BN;
  readonly swapOutAmountToken0: BN;
  readonly status: number;
  readonly padding: Array<number>;
  readonly rewardInfos: Array<types.RewardInfo>;
  readonly tickArrayBitmap: Array<BN>;
  readonly totalFeesToken0: BN;
  readonly totalFeesClaimedToken0: BN;
  readonly totalFeesToken1: BN;
  readonly totalFeesClaimedToken1: BN;
  readonly fundFeesToken0: BN;
  readonly fundFeesToken1: BN;
  readonly openTime: BN;
  readonly padding1: Array<BN>;
  readonly padding2: Array<BN>;

  static readonly discriminator = Buffer.from([247, 237, 227, 245, 215, 195, 222, 70]);

  static readonly layout = borsh.struct([
    borsh.array(borsh.u8(), 1, 'bump'),
    borsh.publicKey('ammConfig'),
    borsh.publicKey('owner'),
    borsh.publicKey('tokenMint0'),
    borsh.publicKey('tokenMint1'),
    borsh.publicKey('tokenVault0'),
    borsh.publicKey('tokenVault1'),
    borsh.publicKey('observationKey'),
    borsh.u8('mintDecimals0'),
    borsh.u8('mintDecimals1'),
    borsh.u16('tickSpacing'),
    borsh.u128('liquidity'),
    borsh.u128('sqrtPriceX64'),
    borsh.i32('tickCurrent'),
    borsh.u16('observationIndex'),
    borsh.u16('observationUpdateDuration'),
    borsh.u128('feeGrowthGlobal0X64'),
    borsh.u128('feeGrowthGlobal1X64'),
    borsh.u64('protocolFeesToken0'),
    borsh.u64('protocolFeesToken1'),
    borsh.u128('swapInAmountToken0'),
    borsh.u128('swapOutAmountToken1'),
    borsh.u128('swapInAmountToken1'),
    borsh.u128('swapOutAmountToken0'),
    borsh.u8('status'),
    borsh.array(borsh.u8(), 7, 'padding'),
    borsh.array(types.RewardInfo.layout(), 3, 'rewardInfos'),
    borsh.array(borsh.u64(), 16, 'tickArrayBitmap'),
    borsh.u64('totalFeesToken0'),
    borsh.u64('totalFeesClaimedToken0'),
    borsh.u64('totalFeesToken1'),
    borsh.u64('totalFeesClaimedToken1'),
    borsh.u64('fundFeesToken0'),
    borsh.u64('fundFeesToken1'),
    borsh.u64('openTime'),
    borsh.array(borsh.u64(), 25, 'padding1'),
    borsh.array(borsh.u64(), 32, 'padding2'),
  ]);

  constructor(fields: PoolStateFields) {
    this.bump = fields.bump;
    this.ammConfig = fields.ammConfig;
    this.owner = fields.owner;
    this.tokenMint0 = fields.tokenMint0;
    this.tokenMint1 = fields.tokenMint1;
    this.tokenVault0 = fields.tokenVault0;
    this.tokenVault1 = fields.tokenVault1;
    this.observationKey = fields.observationKey;
    this.mintDecimals0 = fields.mintDecimals0;
    this.mintDecimals1 = fields.mintDecimals1;
    this.tickSpacing = fields.tickSpacing;
    this.liquidity = fields.liquidity;
    this.sqrtPriceX64 = fields.sqrtPriceX64;
    this.tickCurrent = fields.tickCurrent;
    this.observationIndex = fields.observationIndex;
    this.observationUpdateDuration = fields.observationUpdateDuration;
    this.feeGrowthGlobal0X64 = fields.feeGrowthGlobal0X64;
    this.feeGrowthGlobal1X64 = fields.feeGrowthGlobal1X64;
    this.protocolFeesToken0 = fields.protocolFeesToken0;
    this.protocolFeesToken1 = fields.protocolFeesToken1;
    this.swapInAmountToken0 = fields.swapInAmountToken0;
    this.swapOutAmountToken1 = fields.swapOutAmountToken1;
    this.swapInAmountToken1 = fields.swapInAmountToken1;
    this.swapOutAmountToken0 = fields.swapOutAmountToken0;
    this.status = fields.status;
    this.padding = fields.padding;
    this.rewardInfos = fields.rewardInfos.map((item) => new types.RewardInfo({ ...item }));
    this.tickArrayBitmap = fields.tickArrayBitmap;
    this.totalFeesToken0 = fields.totalFeesToken0;
    this.totalFeesClaimedToken0 = fields.totalFeesClaimedToken0;
    this.totalFeesToken1 = fields.totalFeesToken1;
    this.totalFeesClaimedToken1 = fields.totalFeesClaimedToken1;
    this.fundFeesToken0 = fields.fundFeesToken0;
    this.fundFeesToken1 = fields.fundFeesToken1;
    this.openTime = fields.openTime;
    this.padding1 = fields.padding1;
    this.padding2 = fields.padding2;
  }

  static async fetch(c: Connection, address: PublicKey, programId: PublicKey = PROGRAM_ID): Promise<PoolState | null> {
    const info = await c.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[],
    programId: PublicKey = PROGRAM_ID
  ): Promise<Array<PoolState | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses);

    return infos.map((info) => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(programId)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): PoolState {
    if (!data.slice(0, 8).equals(PoolState.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = PoolState.layout.decode(data.slice(8));

    return new PoolState({
      bump: dec.bump,
      ammConfig: dec.ammConfig,
      owner: dec.owner,
      tokenMint0: dec.tokenMint0,
      tokenMint1: dec.tokenMint1,
      tokenVault0: dec.tokenVault0,
      tokenVault1: dec.tokenVault1,
      observationKey: dec.observationKey,
      mintDecimals0: dec.mintDecimals0,
      mintDecimals1: dec.mintDecimals1,
      tickSpacing: dec.tickSpacing,
      liquidity: dec.liquidity,
      sqrtPriceX64: dec.sqrtPriceX64,
      tickCurrent: dec.tickCurrent,
      observationIndex: dec.observationIndex,
      observationUpdateDuration: dec.observationUpdateDuration,
      feeGrowthGlobal0X64: dec.feeGrowthGlobal0X64,
      feeGrowthGlobal1X64: dec.feeGrowthGlobal1X64,
      protocolFeesToken0: dec.protocolFeesToken0,
      protocolFeesToken1: dec.protocolFeesToken1,
      swapInAmountToken0: dec.swapInAmountToken0,
      swapOutAmountToken1: dec.swapOutAmountToken1,
      swapInAmountToken1: dec.swapInAmountToken1,
      swapOutAmountToken0: dec.swapOutAmountToken0,
      status: dec.status,
      padding: dec.padding,
      rewardInfos: dec.rewardInfos.map((item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>
        types.RewardInfo.fromDecoded(item)
      ),
      tickArrayBitmap: dec.tickArrayBitmap,
      totalFeesToken0: dec.totalFeesToken0,
      totalFeesClaimedToken0: dec.totalFeesClaimedToken0,
      totalFeesToken1: dec.totalFeesToken1,
      totalFeesClaimedToken1: dec.totalFeesClaimedToken1,
      fundFeesToken0: dec.fundFeesToken0,
      fundFeesToken1: dec.fundFeesToken1,
      openTime: dec.openTime,
      padding1: dec.padding1,
      padding2: dec.padding2,
    });
  }

  toJSON(): PoolStateJSON {
    return {
      bump: this.bump,
      ammConfig: this.ammConfig.toString(),
      owner: this.owner.toString(),
      tokenMint0: this.tokenMint0.toString(),
      tokenMint1: this.tokenMint1.toString(),
      tokenVault0: this.tokenVault0.toString(),
      tokenVault1: this.tokenVault1.toString(),
      observationKey: this.observationKey.toString(),
      mintDecimals0: this.mintDecimals0,
      mintDecimals1: this.mintDecimals1,
      tickSpacing: this.tickSpacing,
      liquidity: this.liquidity.toString(),
      sqrtPriceX64: this.sqrtPriceX64.toString(),
      tickCurrent: this.tickCurrent,
      observationIndex: this.observationIndex,
      observationUpdateDuration: this.observationUpdateDuration,
      feeGrowthGlobal0X64: this.feeGrowthGlobal0X64.toString(),
      feeGrowthGlobal1X64: this.feeGrowthGlobal1X64.toString(),
      protocolFeesToken0: this.protocolFeesToken0.toString(),
      protocolFeesToken1: this.protocolFeesToken1.toString(),
      swapInAmountToken0: this.swapInAmountToken0.toString(),
      swapOutAmountToken1: this.swapOutAmountToken1.toString(),
      swapInAmountToken1: this.swapInAmountToken1.toString(),
      swapOutAmountToken0: this.swapOutAmountToken0.toString(),
      status: this.status,
      padding: this.padding,
      rewardInfos: this.rewardInfos.map((item) => item.toJSON()),
      tickArrayBitmap: this.tickArrayBitmap.map((item) => item.toString()),
      totalFeesToken0: this.totalFeesToken0.toString(),
      totalFeesClaimedToken0: this.totalFeesClaimedToken0.toString(),
      totalFeesToken1: this.totalFeesToken1.toString(),
      totalFeesClaimedToken1: this.totalFeesClaimedToken1.toString(),
      fundFeesToken0: this.fundFeesToken0.toString(),
      fundFeesToken1: this.fundFeesToken1.toString(),
      openTime: this.openTime.toString(),
      padding1: this.padding1.map((item) => item.toString()),
      padding2: this.padding2.map((item) => item.toString()),
    };
  }

  static fromJSON(obj: PoolStateJSON): PoolState {
    return new PoolState({
      bump: obj.bump,
      ammConfig: new PublicKey(obj.ammConfig),
      owner: new PublicKey(obj.owner),
      tokenMint0: new PublicKey(obj.tokenMint0),
      tokenMint1: new PublicKey(obj.tokenMint1),
      tokenVault0: new PublicKey(obj.tokenVault0),
      tokenVault1: new PublicKey(obj.tokenVault1),
      observationKey: new PublicKey(obj.observationKey),
      mintDecimals0: obj.mintDecimals0,
      mintDecimals1: obj.mintDecimals1,
      tickSpacing: obj.tickSpacing,
      liquidity: new BN(obj.liquidity),
      sqrtPriceX64: new BN(obj.sqrtPriceX64),
      tickCurrent: obj.tickCurrent,
      observationIndex: obj.observationIndex,
      observationUpdateDuration: obj.observationUpdateDuration,
      feeGrowthGlobal0X64: new BN(obj.feeGrowthGlobal0X64),
      feeGrowthGlobal1X64: new BN(obj.feeGrowthGlobal1X64),
      protocolFeesToken0: new BN(obj.protocolFeesToken0),
      protocolFeesToken1: new BN(obj.protocolFeesToken1),
      swapInAmountToken0: new BN(obj.swapInAmountToken0),
      swapOutAmountToken1: new BN(obj.swapOutAmountToken1),
      swapInAmountToken1: new BN(obj.swapInAmountToken1),
      swapOutAmountToken0: new BN(obj.swapOutAmountToken0),
      status: obj.status,
      padding: obj.padding,
      rewardInfos: obj.rewardInfos.map((item) => types.RewardInfo.fromJSON(item)),
      tickArrayBitmap: obj.tickArrayBitmap.map((item) => new BN(item)),
      totalFeesToken0: new BN(obj.totalFeesToken0),
      totalFeesClaimedToken0: new BN(obj.totalFeesClaimedToken0),
      totalFeesToken1: new BN(obj.totalFeesToken1),
      totalFeesClaimedToken1: new BN(obj.totalFeesClaimedToken1),
      fundFeesToken0: new BN(obj.fundFeesToken0),
      fundFeesToken1: new BN(obj.fundFeesToken1),
      openTime: new BN(obj.openTime),
      padding1: obj.padding1.map((item) => new BN(item)),
      padding2: obj.padding2.map((item) => new BN(item)),
    });
  }
}

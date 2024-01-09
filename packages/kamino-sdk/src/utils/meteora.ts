import { BASIS_POINT_MAX, LBCLMM, PositionDataXs, PositionVersion } from '@meteora-ag/dlmm-sdk';
import { Connection, PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { U64_MAX } from '../constants/numericalValues';

export function getPriceOfBinByBinId(binId: number, tickSpacing: number): Decimal {
  const binStepNum = new Decimal(tickSpacing).div(new Decimal(BASIS_POINT_MAX));
  return new Decimal(1).add(new Decimal(binStepNum)).pow(new Decimal(binId));
}

export function getBinIdFromPrice(price: Decimal, tickSpacing: number, min: boolean): number {
  const binStepNum = new Decimal(tickSpacing).div(new Decimal(BASIS_POINT_MAX));
  const binId = price.log().dividedBy(new Decimal(1).add(binStepNum).log());
  return (min ? binId.floor() : binId.ceil()).toNumber();
}

export function getPriceOfBinByBinIdWithDecimals(
  binId: number,
  tickSpacing: number,
  decimalsA: number,
  decimalsB: number
): Decimal {
  return getPriceOfBinByBinId(binId, tickSpacing)
    .mul(new Decimal(10).pow(decimalsA))
    .div(new Decimal(10).pow(decimalsB));
}

export function getBinIdFromPriceWithDecimals(
  price: Decimal,
  tickSpacing: number,
  min: boolean,
  decimalsA: number,
  decimalsB: number
): number {
  let scaledPrice = price.mul(new Decimal(10).pow(decimalsB)).div(new Decimal(10).pow(decimalsA));
  return getBinIdFromPrice(scaledPrice, tickSpacing, min);
}

export function getPriceFromQ64Price(price: Decimal, decimalsA: number, decimalsB: number): Decimal {
  let scaledPrice = price.mul(new Decimal(10).pow(decimalsA)).div(new Decimal(10).pow(decimalsB));
  return scaledPrice.div(new Decimal(U64_MAX));
}

export async function readPositionForUser(
  connection: Connection,
  pool: PublicKey,
  user: PublicKey,
  userPosition: PublicKey
): Promise<MeteoraPosition> {
  const positionsMap = await LBCLMM.getAllLbPairPositionsByUser(connection, user);
  let position = positionsMap.get(pool.toString());
  if (!position) {
    throw new Error(`Could not find pool ${pool} when fetching all pool-positions for user ${user}`);
  }
  const poolPosition = position.lbPairPositionsData.find((position) => position.publicKey.equals(userPosition));
  if (!poolPosition) {
    throw new Error(
      `Could not find position ${userPosition} when fetching all pool-positions for user ${user} and pool ${pool}`
    );
  }

  return {
    publicKey: userPosition,
    positionData: poolPosition.positionData,
    version: poolPosition.version,
  };
}

// export function

export type MeteoraPosition = {
  publicKey: PublicKey;
  positionData: PositionDataXs;
  version: PositionVersion;
};

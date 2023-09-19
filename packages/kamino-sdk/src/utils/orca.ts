import { PublicKey } from '@solana/web3.js';

export function getTickArray(
  programId: PublicKey,
  whirlpoolAddress: PublicKey,
  startTick: number
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('tick_array'), whirlpoolAddress.toBuffer(), Buffer.from(startTick.toString())],
    programId
  );
}

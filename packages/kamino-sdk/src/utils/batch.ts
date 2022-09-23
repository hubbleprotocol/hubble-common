import { PublicKey } from '@solana/web3.js';

export async function batchFetchMultipleAccounts<T>(
  addresses: Array<PublicKey>,
  fetchBatch: (chunk: Array<PublicKey>) => Promise<Array<T>>
): Promise<Array<T>> {
  let chunkSize = 100; // limit for web3 client
  let results: Array<Array<T>> = await Promise.all(chunks(addresses, chunkSize).map((chunk) => fetchBatch(chunk)));

  let merged = [];
  for (let result of results) {
    merged.push(...result);
  }
  return merged;
}

export function chunks<T>(array: T[], size: number): T[][] {
  return Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index) =>
    array.slice(index * size, (index + 1) * size)
  );
}

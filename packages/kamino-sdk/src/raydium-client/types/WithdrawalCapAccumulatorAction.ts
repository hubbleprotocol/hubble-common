import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh';

export interface KeepAccumulatorJSON {
  kind: 'KeepAccumulator';
}

export class KeepAccumulator {
  static readonly discriminator = 0;
  static readonly kind = 'KeepAccumulator';
  readonly discriminator = 0;
  readonly kind = 'KeepAccumulator';

  toJSON(): KeepAccumulatorJSON {
    return {
      kind: 'KeepAccumulator',
    };
  }

  toEncodable() {
    return {
      KeepAccumulator: {},
    };
  }
}

export interface ResetAccumulatorJSON {
  kind: 'ResetAccumulator';
}

export class ResetAccumulator {
  static readonly discriminator = 1;
  static readonly kind = 'ResetAccumulator';
  readonly discriminator = 1;
  readonly kind = 'ResetAccumulator';

  toJSON(): ResetAccumulatorJSON {
    return {
      kind: 'ResetAccumulator',
    };
  }

  toEncodable() {
    return {
      ResetAccumulator: {},
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.WithdrawalCapAccumulatorActionKind {
  if (typeof obj !== 'object') {
    throw new Error('Invalid enum object');
  }

  if ('KeepAccumulator' in obj) {
    return new KeepAccumulator();
  }
  if ('ResetAccumulator' in obj) {
    return new ResetAccumulator();
  }

  throw new Error('Invalid enum object');
}

export function fromJSON(obj: types.WithdrawalCapAccumulatorActionJSON): types.WithdrawalCapAccumulatorActionKind {
  switch (obj.kind) {
    case 'KeepAccumulator': {
      return new KeepAccumulator();
    }
    case 'ResetAccumulator': {
      return new ResetAccumulator();
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([borsh.struct([], 'KeepAccumulator'), borsh.struct([], 'ResetAccumulator')]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}

import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh';

export interface SaturatingOverflowJSON {
  kind: 'SaturatingOverflow';
}

export class SaturatingOverflow {
  static readonly discriminator = 0;
  static readonly kind = 'SaturatingOverflow';
  readonly discriminator = 0;
  readonly kind = 'SaturatingOverflow';

  toJSON(): SaturatingOverflowJSON {
    return {
      kind: 'SaturatingOverflow',
    };
  }

  toEncodable() {
    return {
      SaturatingOverflow: {},
    };
  }
}

export interface ErrorOnOverflowJSON {
  kind: 'ErrorOnOverflow';
}

export class ErrorOnOverflow {
  static readonly discriminator = 1;
  static readonly kind = 'ErrorOnOverflow';
  readonly discriminator = 1;
  readonly kind = 'ErrorOnOverflow';

  toJSON(): ErrorOnOverflowJSON {
    return {
      kind: 'ErrorOnOverflow',
    };
  }

  toEncodable() {
    return {
      ErrorOnOverflow: {},
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.WithdrawalCapOverflowActionKind {
  if (typeof obj !== 'object') {
    throw new Error('Invalid enum object');
  }

  if ('SaturatingOverflow' in obj) {
    return new SaturatingOverflow();
  }
  if ('ErrorOnOverflow' in obj) {
    return new ErrorOnOverflow();
  }

  throw new Error('Invalid enum object');
}

export function fromJSON(obj: types.WithdrawalCapOverflowActionJSON): types.WithdrawalCapOverflowActionKind {
  switch (obj.kind) {
    case 'SaturatingOverflow': {
      return new SaturatingOverflow();
    }
    case 'ErrorOnOverflow': {
      return new ErrorOnOverflow();
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([borsh.struct([], 'SaturatingOverflow'), borsh.struct([], 'ErrorOnOverflow')]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}

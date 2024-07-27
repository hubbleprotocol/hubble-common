import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface AddLiquiditySingleSidePreciseParameterFields {
  bins: Array<types.CompressedBinDepositAmountFields>
  decompressMultiplier: BN
}

export interface AddLiquiditySingleSidePreciseParameterJSON {
  bins: Array<types.CompressedBinDepositAmountJSON>
  decompressMultiplier: string
}

export class AddLiquiditySingleSidePreciseParameter {
  readonly bins: Array<types.CompressedBinDepositAmount>
  readonly decompressMultiplier: BN

  constructor(fields: AddLiquiditySingleSidePreciseParameterFields) {
    this.bins = fields.bins.map(
      (item) => new types.CompressedBinDepositAmount({ ...item })
    )
    this.decompressMultiplier = fields.decompressMultiplier
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.vec(types.CompressedBinDepositAmount.layout(), "bins"),
        borsh.u64("decompressMultiplier"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new AddLiquiditySingleSidePreciseParameter({
      bins: obj.bins.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.CompressedBinDepositAmount.fromDecoded(item)
      ),
      decompressMultiplier: obj.decompressMultiplier,
    })
  }

  static toEncodable(fields: AddLiquiditySingleSidePreciseParameterFields) {
    return {
      bins: fields.bins.map((item) =>
        types.CompressedBinDepositAmount.toEncodable(item)
      ),
      decompressMultiplier: fields.decompressMultiplier,
    }
  }

  toJSON(): AddLiquiditySingleSidePreciseParameterJSON {
    return {
      bins: this.bins.map((item) => item.toJSON()),
      decompressMultiplier: this.decompressMultiplier.toString(),
    }
  }

  static fromJSON(
    obj: AddLiquiditySingleSidePreciseParameterJSON
  ): AddLiquiditySingleSidePreciseParameter {
    return new AddLiquiditySingleSidePreciseParameter({
      bins: obj.bins.map((item) =>
        types.CompressedBinDepositAmount.fromJSON(item)
      ),
      decompressMultiplier: new BN(obj.decompressMultiplier),
    })
  }

  toEncodable() {
    return AddLiquiditySingleSidePreciseParameter.toEncodable(this)
  }
}

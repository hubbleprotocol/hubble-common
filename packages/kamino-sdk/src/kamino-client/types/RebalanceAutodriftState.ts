import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface RebalanceAutodriftStateFields {
  lastWindow: types.RebalanceAutodriftWindowFields
  currentWindow: types.RebalanceAutodriftWindowFields
  step: types.RebalanceAutodriftStepKind
}

export interface RebalanceAutodriftStateJSON {
  lastWindow: types.RebalanceAutodriftWindowJSON
  currentWindow: types.RebalanceAutodriftWindowJSON
  step: types.RebalanceAutodriftStepJSON
}

export class RebalanceAutodriftState {
  readonly lastWindow: types.RebalanceAutodriftWindow
  readonly currentWindow: types.RebalanceAutodriftWindow
  readonly step: types.RebalanceAutodriftStepKind

  constructor(fields: RebalanceAutodriftStateFields) {
    this.lastWindow = new types.RebalanceAutodriftWindow({
      ...fields.lastWindow,
    })
    this.currentWindow = new types.RebalanceAutodriftWindow({
      ...fields.currentWindow,
    })
    this.step = fields.step
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.RebalanceAutodriftWindow.layout("lastWindow"),
        types.RebalanceAutodriftWindow.layout("currentWindow"),
        types.RebalanceAutodriftStep.layout("step"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new RebalanceAutodriftState({
      lastWindow: types.RebalanceAutodriftWindow.fromDecoded(obj.lastWindow),
      currentWindow: types.RebalanceAutodriftWindow.fromDecoded(
        obj.currentWindow
      ),
      step: types.RebalanceAutodriftStep.fromDecoded(obj.step),
    })
  }

  static toEncodable(fields: RebalanceAutodriftStateFields) {
    return {
      lastWindow: types.RebalanceAutodriftWindow.toEncodable(fields.lastWindow),
      currentWindow: types.RebalanceAutodriftWindow.toEncodable(
        fields.currentWindow
      ),
      step: fields.step.toEncodable(),
    }
  }

  toJSON(): RebalanceAutodriftStateJSON {
    return {
      lastWindow: this.lastWindow.toJSON(),
      currentWindow: this.currentWindow.toJSON(),
      step: this.step.toJSON(),
    }
  }

  static fromJSON(obj: RebalanceAutodriftStateJSON): RebalanceAutodriftState {
    return new RebalanceAutodriftState({
      lastWindow: types.RebalanceAutodriftWindow.fromJSON(obj.lastWindow),
      currentWindow: types.RebalanceAutodriftWindow.fromJSON(obj.currentWindow),
      step: types.RebalanceAutodriftStep.fromJSON(obj.step),
    })
  }

  toEncodable() {
    return RebalanceAutodriftState.toEncodable(this)
  }
}

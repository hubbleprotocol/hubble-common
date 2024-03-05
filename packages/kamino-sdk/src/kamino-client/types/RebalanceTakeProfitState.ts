import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface RebalanceTakeProfitStateFields {
  step: types.RebalanceTakeProfitStepKind
}

export interface RebalanceTakeProfitStateJSON {
  step: types.RebalanceTakeProfitStepJSON
}

export class RebalanceTakeProfitState {
  readonly step: types.RebalanceTakeProfitStepKind

  constructor(fields: RebalanceTakeProfitStateFields) {
    this.step = fields.step
  }

  static layout(property?: string) {
    return borsh.struct(
      [types.RebalanceTakeProfitStep.layout("step")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new RebalanceTakeProfitState({
      step: types.RebalanceTakeProfitStep.fromDecoded(obj.step),
    })
  }

  static toEncodable(fields: RebalanceTakeProfitStateFields) {
    return {
      step: fields.step.toEncodable(),
    }
  }

  toJSON(): RebalanceTakeProfitStateJSON {
    return {
      step: this.step.toJSON(),
    }
  }

  static fromJSON(obj: RebalanceTakeProfitStateJSON): RebalanceTakeProfitState {
    return new RebalanceTakeProfitState({
      step: types.RebalanceTakeProfitStep.fromJSON(obj.step),
    })
  }

  toEncodable() {
    return RebalanceTakeProfitState.toEncodable(this)
  }
}

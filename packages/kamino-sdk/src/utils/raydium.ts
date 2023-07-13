import Decimal from 'decimal.js';

export function priceToTickIndexWithRounding(price: number): number {
  let tickIndex = new Decimal(Math.log(Math.sqrt(price)))
    .div(new Decimal(Math.log(Math.sqrt(1.0001))))
    .round()
    .toNumber();

  return tickIndex;
}

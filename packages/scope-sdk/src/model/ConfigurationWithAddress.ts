import { PublicKey } from '@solana/web3.js';
import { Configuration } from '../accounts';

export class ConfigurationWithAddress {
  configuration: Configuration;
  address: PublicKey;

  constructor(configuration: Configuration, address: PublicKey) {
    this.configuration = configuration;
    this.address = address;
  }
}

export default ConfigurationWithAddress;

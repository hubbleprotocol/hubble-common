# Hubble Config

Hubble config is a public registry/configuration with Solana public keys that are used by [Hubble Protocol](https://hubbleprotocol.io).

## Install

[![npm](https://img.shields.io/npm/v/@hubbleprotocol/hubble-config)](https://www.npmjs.com/package/@hubbleprotocol/hubble-config)

```shell
npm install @hubbleprotocol/hubble-config
```

## Usage

```js
// For ESM
import { getAllConfigs, getConfigByEnv } from "@hubbleprotocol/hubble-config";

// For CommonJS
const config = require("@hubbleprotocol/hubble-config");

// Get all configs: mainnet-beta, devnet, localnet, testnet configs
const configs = getAllConfigs();

// Get config by solana environment:
const mainnetConfig = getConfigByEnv('mainnet-beta');
const devnetConfig = getConfigByEnv('devnet');
```
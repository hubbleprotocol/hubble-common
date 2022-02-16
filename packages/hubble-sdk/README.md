# Hubble SDK

The Hubble SDK is a TypeScript client SDK for easy access to [Hubble Protocol](https://hubbleprotocol.io) data and operations.

## Install

[![npm](https://img.shields.io/npm/v/@hubbleprotocol/hubble-sdk)](https://www.npmjs.com/package/@hubbleprotocol/hubble-sdk)

```shell
npm install @hubbleprotocol/hubble-sdk
```

## Usage

TODO

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
# Hubble Common

Hubble common NPM packages.

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Packages

| Package                         | Description                        | Docs                                         | Version                                                                                                                           |
|---------------------------------|------------------------------------|----------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `@hubbleprotocol/hubble-config` | Hubble Solana config (public keys) | [README](./packages/hubble-config/README.md) | [![npm](https://img.shields.io/npm/v/@hubbleprotocol/hubble-config)](https://www.npmjs.com/package/@hubbleprotocol/hubble-config) |
| `@hubbleprotocol/hubble-idl`    | Hubble IDL for Anchor              | [README](./packages/hubble-idl/README.md)    | [![npm](https://img.shields.io/npm/v/@hubbleprotocol/hubble-idl)](https://www.npmjs.com/package/@hubbleprotocol/hubble-idl)       |

## Deployment

We use [lernajs](https://lerna.js.org/) for monorepo package management and publishing. 
Versioning and publishing is done automatically (detects changes if any) by Lerna.

Currently, deployment is done automatically by GitHub Action. 
Everything that gets pushed to `master` branch will be automatically checked for changes and deployed (if needed).


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[Apache 2.0](https://choosealicense.com/licenses/apache-2.0/)
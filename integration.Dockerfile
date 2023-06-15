FROM hubbleprotocol/anchor-build:0.25.0

COPY / /hubble-common/
WORKDIR /hubble-common

RUN npm install && npx lerna run build

RUN npm test

RUN npm run start-with-test-validator

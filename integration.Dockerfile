FROM hubbleprotocol/anchor-build:0.29.0

COPY / /hubble-common/
WORKDIR /hubble-common

RUN npm install && npx lerna bootstrap && npx lerna run build

RUN npm test

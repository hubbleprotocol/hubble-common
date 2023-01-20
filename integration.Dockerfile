FROM hubbleprotocol/anchor-build:0.25.0

COPY / /hubble-common/
WORKDIR /hubble-common

RUN npm install && npx lerna bootstrap && npx lerna run build

RUN npm run dump-kamino-programs
RUN npm run start-with-test-validator


# RUN --mount=type=ssh ./integration.sh

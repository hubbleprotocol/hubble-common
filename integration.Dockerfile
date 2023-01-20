FROM hubbleprotocol/anchor-build:0.25.0

# COPY package*.json package-lock.json /hubble-common/
COPY / /hubble-common/
WORKDIR /hubble-common

RUN npm install 

RUN npm run dump-kamino-programs
RUN npm run start-with-test-validator


# RUN --mount=type=ssh ./integration.sh

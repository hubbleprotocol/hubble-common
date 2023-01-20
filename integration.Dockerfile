FROM hubbleprotocol/anchor-build:0.25.0

# Cache node_modules in a docker layer as log as package.json and yarn.lock did not change
# COPY package*.json package-lock.json /hubble-common/
WORKDIR /hubble-common

RUN npm install

COPY / /hubble-common/

RUN npm run integration-test

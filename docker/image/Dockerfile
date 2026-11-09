# BPMN Server distribution: matching bpmn-server and bpmn-web npm releases.
# Use docker/image/build.sh or build.cmd to tag ralphhanna/bpmn-server.
# Debian provides a supported runtime for mongodb-memory-server's mongod binary.
FROM node:22-bookworm-slim
LABEL maintainer="ralphhanna@hotmail.com"

# MongoDB binaries launched by mongodb-memory-server require libcurl.so.4.
# The slim Debian base does not include it.
RUN apt-get update \
 && apt-get install -y --no-install-recommends libcurl4 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

ARG BPMN_VERSION=latest
WORKDIR /app

# Initialize an application, remove its generated secrets, and pin the exact published release.
# mongodb-memory-server is a runtime dependency for MONGO_DB_URL=memory.
# Its MongoDB binary is downloaded on first use (requires internet for the initial start).
RUN npx --yes "bpmn-server@$BPMN_VERSION" init . --yes --no-install \
 && rm -f .env \
 && version=$(node -p "require('./package.json').dependencies['bpmn-server'].replace('^', '')") \
 && npm pkg set "dependencies.bpmn-server=$version" "dependencies.bpmn-web=$version" "dependencies.mongodb-memory-server=^10.4.3" \
 && npm install --omit=dev --no-audit --no-fund \
 && npm cache clean --force

ENV NODE_ENV=production
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]

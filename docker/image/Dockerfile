# bpmn-web (with bpmn-server) from npm: the application `npx bpmn-server init` creates, as users install it.
#   docker build -t ralphhanna/bpmn-web .                                         (the latest release)
#   docker build --build-arg BPMN_VERSION=3.5.2 -t ralphhanna/bpmn-web:3.5.2 .    (a release)
# build.cmd and build.sh tag the image with its version, and latest.
FROM node:22-alpine
LABEL maintainer="ralphhanna@hotmail.com"

ARG BPMN_VERSION=latest

WORKDIR /app
# - .env goes: init writes new keys there, and every container of this image would have them. The settings come
#   from the container's environment (docker-compose.yml).
# - The exact release, not init's ^version: an image holds one version, and BPMN_VERSION=latest says which.
RUN npx --yes "bpmn-server@$BPMN_VERSION" init . --yes --no-install \
 && rm .env \
 && version=$(node -p "require('./package.json').dependencies['bpmn-server'].replace('^', '')") \
 && npm pkg set "dependencies.bpmn-server=$version" "dependencies.bpmn-web=$version" \
 && npm install --omit=dev --no-audit --no-fund \
 && npm cache clean --force

# production: the server does not start without SESSION_SECRET and API_KEY, or with the web pages left open
ENV NODE_ENV=production
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]

# bpmn-web (with bpmn-server) from bpmn-web's GitHub source.
#   docker build -t ralphhanna/bpmn-web .                                         (bpmn-web's main)
#   docker build --build-arg BPMN_WEB_REF=<tag or branch> -t ralphhanna/bpmn-web:<version> .
FROM node:22-alpine
LABEL maintainer="ralphhanna@hotmail.com"

ARG BPMN_WEB_REF=main

RUN apk add --no-cache git
WORKDIR /app
# npm ci installs the versions bpmn-web's package-lock.json pins, bpmn-server among them
RUN git clone --depth 1 --branch "$BPMN_WEB_REF" https://github.com/bpmnServer/bpmn-web.git . \
 && npm ci \
 && npm cache clean --force

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start"]

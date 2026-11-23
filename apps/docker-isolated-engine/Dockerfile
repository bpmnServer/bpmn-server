FROM node:22-bookworm-slim AS build

RUN apt-get update \
 && apt-get install -y --no-install-recommends libcurl4 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Install the repository workspaces first. The application is outside the root
# workspaces, so its own lockfile is installed after the local packages build.
COPY package.json package-lock.json ./
COPY packages/bpmn-server/package.json packages/bpmn-server/package.json
COPY packages/bpmn-client/package.json packages/bpmn-client/package.json
COPY packages/bpmn-mcp/package.json packages/bpmn-mcp/package.json
COPY packages/bpmn-web/package.json packages/bpmn-web/package.json
COPY apps/testSampleApp/package.json apps/testSampleApp/package.json
COPY apps/sampleApp/package.json apps/sampleApp/package.json
RUN npm ci --ignore-scripts

COPY packages ./packages
COPY docs/docs/ai ./docs/docs/ai
RUN npm run build
RUN npm prune --omit=dev

COPY apps/hrdemo ./apps/hrdemo
RUN npm ci --prefix apps/hrdemo --ignore-scripts
RUN npm run build --prefix apps/hrdemo

FROM node:22-bookworm-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends libcurl4 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
WORKDIR /workspace

# Keep the workspace layout so hrDemo's file dependencies remain local links.
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/packages ./packages
COPY --from=build /workspace/apps/hrdemo ./apps/hrdemo

WORKDIR /workspace/apps/hrdemo
EXPOSE 3000
CMD ["npm", "run", "serve"]

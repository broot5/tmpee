FROM oven/bun
WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN mkdir -p packages/shared
COPY packages/shared/package.json packages/shared/package.json

RUN mkdir -p packages/worker
COPY packages/worker/package.json packages/worker/package.json

RUN mkdir -p packages/server
COPY packages/server/package.json packages/server/package.json

RUN bun install --frozen-lockfile --production

COPY packages/ packages/

USER bun
ENTRYPOINT [ "bun", "run", "serve" ]
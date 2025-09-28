FROM oven/bun:alpine AS base
WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/app
COPY . /temp/app/
RUN cd /temp/app && bun install --frozen-lockfile
ENV NODE_ENV=production
RUN cd /temp/app && bun run client:build


RUN mkdir -p /temp/server
COPY server/package.json /temp/server/
RUN cd /temp/server && bun install --production

FROM base AS release
COPY --from=install /temp/server/node_modules node_modules
COPY --from=install /temp/app/server server
COPY --from=install /temp/app/client/dist client/dist
COPY package.json bun.lock .
RUN mkdir -p storage/database

USER bun
EXPOSE 4200/tcp
# CMD ["ls", "-lah", "./server"]
CMD ["bun", "run", "server:serve"]
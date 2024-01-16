FROM node:21.5.0-bookworm-slim as build

WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:21.5.0-bookworm-slim as deploy
WORKDIR app
COPY . .
COPY --from=build /app/dist dist
RUN yarn install --prod --frozen-lockfile

ENTRYPOINT pwd; node server/index.js

FROM node:14-alpine AS base

WORKDIR /usr/src/app
COPY package*.json knexfile.js ./
RUN mkdir -p ./storage/database

FROM base AS build
RUN npm install
COPY . .
RUN npm run build

FROM build as test
CMD [ "npm", "run", "test" ]

FROM build AS development
CMD ["npm", "run", "dev"]

FROM base AS production
COPY --from=build /usr/src/app/build ./build
RUN npm install --production && npm run migrate
CMD ["npm", "start"]

FROM node:latest AS development
WORKDIR /travel-care/api
ADD package*.json .
RUN yarn install
ADD . .
RUN yarn build


FROM node:latest AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /travel-care/api

COPY --from=development /travel-care/api .

EXPOSE 8000

CMD [ "yarn", "start" ]
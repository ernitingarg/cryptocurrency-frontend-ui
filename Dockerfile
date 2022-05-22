FROM node:12.21.0-alpine

WORKDIR /workdir

ADD . /workdir

RUN npm install -g vercel

CMD ["yarn", "dev"]


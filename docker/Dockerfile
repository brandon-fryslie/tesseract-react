FROM node:11.9.0 as base

WORKDIR /usr/src/app

# Copy the necessary files for the build
COPY \
  tmp/package.json \
  tmp/yarn.lock \
  tmp/webpack.config.js \
  tmp/.eslintrc \
  ./

COPY tmp ./

RUN yarn install

RUN yarn build-dev

# Copy the assets into an nginx container
FROM nginx:1.15.12-alpine

COPY --from=base /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

FROM node:11.9.0 as base

WORKDIR /usr/src/app

# Copy config files for yarn install
COPY tmp/package.json tmp/yarn.lock ./

RUN yarn install

# Copy config files for build
COPY \
  tmp/babel.config.js \
  tmp/webpack.config.js \
  tmp/.eslintrc \
  ./

# Copy all of the source.  If we were to copy all the files immediately, we would need to
# run yarn install every time a source file changes.  we improve caching by only copying
# the files we need for each step
COPY tmp ./

RUN yarn build-dev

# Copy the assets into an nginx container
FROM nginx:1.15.12-alpine

EXPOSE 80

# Install curl, gucci, and libc compatibility (required for gucci)
RUN apk --no-cache add curl libc6-compat \
  && curl -o /usr/local/bin/gucci -L "https://github.com/noqcks/gucci/releases/download/1.2.1/gucci-v1.2.1-linux-amd64" \
  && chmod +x /usr/local/bin/gucci \
  && mkdir /app

# Copy files from previous stage
COPY --from=base /usr/src/app/build /usr/share/nginx/html

COPY files/envConfig.js.tpl /app/envConfig.js.tpl
COPY files/start.sh /app/start.sh

CMD ["/app/start.sh"]

#!/bin/sh -el

echo "Starting tesseract-ui"

echo "Running gucci to generate configuration file"
[[ -f /app/tesseract-config.yml ]] && { gucci_file_arg="--vars-file /app/tesseract-config.yml"; }

gucci $gucci_file_arg /app/envConfig.js.tpl > /usr/share/nginx/html/envConfig.js

echo "Rendered configuration file 'envConfig.js':"
cat /usr/share/nginx/html/envConfig.js

echo "Starting nginx"
nginx -g 'daemon off;'

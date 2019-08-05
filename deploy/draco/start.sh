#!/bin/bash -el

script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker-compose -p tesseract-ui -f $script_dir/docker-compose.yml up

#!/bin/bash -el

script_path="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
image_name="tesseractpixel/tesseract-ui"
image_tag="latest"


if ! docker images | grep $image_name | grep -q $image_tag; then
  echo "The docker image doesn't exist.  Please run ./build.sh first"
  exit 1
fi

echo "Running docker image ${image_name}:${image_tag}"

docker run -ti -p 8080:80 $image_name

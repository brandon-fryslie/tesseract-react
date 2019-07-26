#!/bin/bash -el

script_path="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
tmp_dir="${script_path}/tmp"

cleanup() {
  rm -rf $tmp_dir

  local exit_code=$1
  local previous_command=$BASH_COMMAND
  [[ $exit_code -ne 0 ]] && [[ ! $previous_command =~ exit* ]] && echo "INFO: Script exited with code $exit_code from command $previous_command"
  exit $exit_code
}
trap 'cleanup $?' EXIT

# default tag to latest
image_tag="latest"

# Parse options
while [[ $# -gt 0 ]]; do
  key="$1"

  case $key in
    -t|--tag) image_tag="$2"; shift; shift;;
    *) red "Unknown option: $1"; exit 1;;
  esac
done

image_name="tesseractpixel/tesseract-ui:${image_tag}"

mkdir -p $tmp_dir

cp \
  "${script_path}/../babel.config.js" \
  "${script_path}/../package.json" \
  "${script_path}/../yarn.lock" \
  "${script_path}/../webpack.config.js" \
  "${script_path}/../.eslintrc" \
  "${script_path}/tmp"

cp -R "${script_path}/../src" "${script_path}/tmp/src"
cp -R "${script_path}/../webpack" "${script_path}/tmp/webpack"

docker build -t $image_name -f "${script_path}/Dockerfile" "${script_path}"

if [[ $PUSH == true ]]; then
  docker push $image_name
fi

rm -rf $tmp_dir

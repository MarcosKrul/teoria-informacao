#!/bin/bash

BASE_URL="http://localhost:3333"

generate_post_data()
{
  cat <<EOF
{
  "probabilidades": [
    "0",
    "=4/5",
    "=1/5"
  ]
}
EOF
}

curl \
  -X POST \
  --header "Content-type: application/json" \
  -d "$(generate_post_data)" \
  "${BASE_URL}/entropia"
#!/bin/bash

BASE_URL="http://localhost:3333"

generate_post_data()
{
  cat <<EOF
{
  "simbolos_saida": [
    "A", 
    "B", 
    "C"
  ],
  "simbolos_entrada_com_prob": [
    {
      "simbolo": "A",
      "probabilidade": "=1/3"
    },
    {
      "simbolo": "B",
      "probabilidade": "=16/27"
    },
    {
      "simbolo": "C",
      "probabilidade": "=2/27"
    }
  ],
  "matriz_prob_condicional": [
    ["0", "=4/5", "=1/5"],
    ["=1/2", "=1/2", "0"],
    ["=1/2", "=2/5", "=1/10"]
  ]
}
EOF
}

curl \
  -X POST \
  --header "Content-type: application/json" \
  -d "$(generate_post_data)" \
    "${BASE_URL}/infos"
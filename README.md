# Teoria da informação

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://teoria-informacao.herokuapp.com)

## Sobre

Automação para cálculo de informações de um canal de comunicação

Engenharia de Computação, UEPG - 8º período

Projeto realizado para a disciplina de Comunicação de Dados

## Rodar o servidor localmente

```
    mkdir teoria-informacao
    cd teoria-informacao
    git clone https://github.com/MarcosKrul/teoria-informacao.git .
    echo "PORT=3333" > .env.development
    yarn
    yarn dev:server
```

## Rotas

| Rota      | Método | Descrição                              |
|---        |---     |---                                |
| /entropia | POST   | Cálculo da entropia de uma lista de probabilidades       |
| /infos    | POST   | Cálculo das informações importantes sobre o canal       |

# Exemplo rota de entropia

* Corpo da requisição

```json
  {
    "probabilidades": [
      "0",
      "=4/5",
      "=1/5"
    ]
  }
```

* Retorno

```json
  {
    "success": true,
    "message": "Operação realizada com sucesso.",
    "content": 0.7219280948873623
  }
```

# Exemplo rota de informações do canal

* Corpo da requisição

```json
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
      ["", "=4/5", "=1/5"],
      ["=1/2", "=1/2", "0"],
      ["=1/2", "=2/5", "=1/10"]
    ]
  }
```

* Retorno

```json
  {
    "success": true,
    "message": "Operação realizada com sucesso.",
    "content": {
      "entropiaCondicionalSaida": 0.9340474425508749,
      "entropiaConjunta": 2.1878488331224615,
      "entropiaEntrada": 1.2538013905715868,
      "equivocacaoCanal": 0.9340474425508749,
      "informacaoMutuaMedia": 0.3197539480207119
    }
  }
```

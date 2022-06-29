# Teoria da informação

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=https%3A%2F%2Fteoria-informacao.herokuapp.com&uri=https%3A%2F%2Fgithub.com%2FMarcosKrul%2Fteoria-informacao%2Fblob%2Fmaster%2Fdocs%2FInsomnia.json)

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

# Rotas

| Rota      | Método | Descrição                              |
|---        |---     |---                                |
| /entropia | POST   | Cálculo da entropia de uma lista de probabilidades       |
| /infos    | POST   | Cálculo das informações importantes sobre o canal       |

## Exemplo rota de entropia

* Corpo da requisição

```json
  {
    "probabilidades": [ "0", "=4/5", "=1/5" ]
  }
```

* Retorno

```json
  {
    "success": true,
    "message": "Operação realizada com sucesso.",
    "content": {
      "simbolo": "H(0,0.8,0.2)",
      "unidade": "sh/símbolo",
      "valor": 0.7219280948873623,
      "descricao": "H(0,0.8,0.2) = 0.72sh/símbolo"
    }
  }
```

## Exemplo rota de informações do canal

* Corpo da requisição

```json
  {
    "simbolos_saida": [ "A", "B", "C"],
    "simbolos_entrada_com_prob": [
      { "simbolo": "A", "probabilidade": "=1/3"   },
      { "simbolo": "B", "probabilidade": "=16/27" },
      { "simbolo": "C", "probabilidade": "=2/27"  }
    ],
    "matriz_prob_condicional": [
      ["0",    "=4/5", "=1/5" ],
      ["=1/2", "=1/2", "0"    ],
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
      "entropiaCondicionalSaida": {
        "simbolo": "H(Y|X)",
        "unidade": "sh/símbolo",
        "valor": 0.9340474425508749,
        "descricao": "H(Y|X) = 0.93sh/símbolo"
      },
      "entropiaConjunta": {
        "simbolo": "H(X,Y)",
        "unidade": "sh/símbolo",
        "valor": 2.1878488331224615,
        "descricao": "H(X,Y) = 2.19sh/símbolo"
      },
      "entropiaEntrada": {
        "simbolo": "H(X)",
        "unidade": "sh/símbolo",
        "valor": 1.2538013905715868,
        "descricao": "H(X) = 1.25sh/símbolo"
      },
      "equivocacaoCanal": {
        "simbolo": "H(X|Y)",
        "unidade": "sh/símbolo",
        "valor": 0.9340474425508749,
        "descricao": "H(X|Y) = 0.93sh/símbolo"
      },
      "informacaoMutuaMedia": {
        "simbolo": "I(X,Y)",
        "unidade": "sh",
        "valor": 0.3197539480207119,
        "descricao": "I(X,Y) = 0.32sh"
      }
    }
  }
```

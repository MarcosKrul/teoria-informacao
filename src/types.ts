type Simbolos = string[];

type MatrizProbabilidade = number[][];

type SimboloComProbabilidade = {
  simbolo: string;
  probabilidade: number;
};

type Grandeza = {
  valor: number;
  simbolo: string;
  unidade: string;
  descricao?: string;
};

export { SimboloComProbabilidade, Simbolos, MatrizProbabilidade, Grandeza };

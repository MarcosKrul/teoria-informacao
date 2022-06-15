import {
  MatrizProbabilidade,
  SimboloComProbabilidade,
  Simbolos,
} from "./types";

interface IInput {
  simbolosSaida: Simbolos;
  simbolosEntrada: SimboloComProbabilidade[];
  matriz: MatrizProbabilidade;
}

interface IOutput {
  entropiaEntrada: number;
  entropiaCondicionalSaida: number;
  entropiaConjunta: number;
  equivocacaoCanal: number;
  informacaoMutuaMedia: number;
}

interface IExec {
  (input: IInput): IOutput;
}

export { IExec };

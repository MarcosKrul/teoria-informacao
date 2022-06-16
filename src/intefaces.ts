import {
  Grandeza,
  MatrizProbabilidade,
  SimboloComProbabilidade,
  Simbolos,
} from "./types";

interface IInput {
  simbolosSaida: Simbolos;
  simbolosEntradaComProb: SimboloComProbabilidade[];
  matrizCondicional: MatrizProbabilidade;
}

interface IOutput {
  entropiaEntrada: Grandeza;
  entropiaCondicionalSaida: Grandeza;
  entropiaConjunta: Grandeza;
  equivocacaoCanal: Grandeza;
  informacaoMutuaMedia: Grandeza;
}

interface IExec {
  (input: IInput): IOutput;
}

export { IExec };

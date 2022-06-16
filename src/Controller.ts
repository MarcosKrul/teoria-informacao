import { NextFunction, Request, Response } from "express";

import { AppError } from "./AppError";
import { IExec } from "./intefaces";
import { MatrizProbabilidade, SimboloComProbabilidade } from "./types";

class Controller {
  private transformToNumber = (value: string): number => {
    if (value.startsWith("=")) {
      const elements = value.replace("=", "").split("/");

      if (!elements || elements.length !== 2)
        throw new AppError(
          400,
          `Não foi possível realizar a operação matemática: ${value}`
        );

      const num = Number(elements[0]);
      const den = Number(elements[1]);

      if (Number.isNaN(num) || Number.isNaN(den))
        throw new AppError(
          400,
          `Não foi possível realizar a operação matemática: ${value}`
        );

      return num / den;
    }

    return Number(value);
  };

  private exec: IExec = ({
    matrizCondicional,
    simbolosEntradaComProb,
    simbolosSaida,
  }) => {
    const matrizProbConjunta: MatrizProbabilidade = [];

    simbolosEntradaComProb.forEach(
      (entrada: SimboloComProbabilidade, index: number) => {
        matrizProbConjunta.push(
          matrizCondicional[index].map(
            (prob: number) => prob * entrada.probabilidade
          )
        );
      }
    );

    const simbolosSaidaComProb: SimboloComProbabilidade[] = simbolosSaida.map(
      (item: string, index: number): SimboloComProbabilidade => ({
        probabilidade: matrizProbConjunta.reduce(
          (acc, vetor) => acc + vetor[index],
          0
        ),
        simbolo: item,
      })
    );

    const auxProbSaida = Math.round(
      this.somatorio(
        simbolosSaidaComProb.map(
          (item: SimboloComProbabilidade): number => item.probabilidade
        )
      )
    );

    if (auxProbSaida !== 1)
      throw new AppError(
        400,
        `A probabilidade resultante do conjunto de símbolos da saída é diferente de 1. P(Y) = ${auxProbSaida}`
      );

    const entropiaEntrada = this.entropiaDeProbabilidades(
      simbolosEntradaComProb.map(
        ({ probabilidade }: SimboloComProbabilidade): number => probabilidade
      )
    );

    const entropiaCondicionalSaida = simbolosEntradaComProb.reduce(
      (acc, item, index) =>
        acc +
        item.probabilidade *
          this.entropiaDeProbabilidades(matrizCondicional[index]),
      0
    );

    const informacaoMutuaMedia = entropiaEntrada - entropiaCondicionalSaida;

    return {
      entropiaCondicionalSaida,
      entropiaConjunta: entropiaEntrada + entropiaCondicionalSaida,
      entropiaEntrada,
      equivocacaoCanal: entropiaEntrada - informacaoMutuaMedia,
      informacaoMutuaMedia,
    };
  };

  private somatorio = (valores: number[]): number =>
    valores.reduce((acc, item) => acc + item, 0);

  private entropiaDeProbabilidades = (probabilidades: number[]): number => {
    const entropia = probabilidades.reduce(
      (current, item) =>
        current + (item > 0 ? item * Math.abs(Math.log2(item)) : 0),
      0
    );

    if (entropia < 0)
      throw new AppError(
        400,
        `A Entropia das probabilidades não pode ser negativa. H(${probabilidades.map(
          (item) => item
        )}) = ${entropia}`
      );

    return entropia;
  };

  postRouteEntropia = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { probabilidades } = req.body;

    if (
      !probabilidades ||
      !Array.isArray(probabilidades) ||
      probabilidades.length === 0
    )
      throw new AppError(
        400,
        "Para calcular a entropia é necessário enviar um vetor de probabilidades válido."
      );

    const formatado = probabilidades.map((item: any): number =>
      this.transformToNumber(item)
    );

    return res.status(200).send({
      success: true,
      message: "Operação realizada com sucesso.",
      content: this.entropiaDeProbabilidades(formatado),
    });
  };

  postRouteInfos = async (req: Request, res: Response): Promise<Response> => {
    const {
      simbolos_entrada_com_prob: simbolosEntrada,
      simbolos_saida: simbolosSaida,
      matriz_prob_condicional: matrizInput,
    } = req.body;

    if (
      !simbolosSaida ||
      !Array.isArray(simbolosSaida) ||
      simbolosSaida.length < 2
    )
      throw new AppError(
        400,
        "O conjunto dos símbolos de saída é obrigatório e deve ser um vetor com, no mínimo, dois elementos."
      );

    if (
      !simbolosEntrada ||
      !Array.isArray(simbolosEntrada) ||
      simbolosEntrada.length < 2
    )
      throw new AppError(
        400,
        "O conjunto dos símbolos de entrada é obrigatório e deve ser um vetor com, no mínimo, dois elementos."
      );

    const matrizCondicional: number[][] = matrizInput.map((linha: any) =>
      linha.map((coluna: any) => this.transformToNumber(coluna))
    );

    const simbolosEntradaComProb = simbolosEntrada.map(
      (item: any): SimboloComProbabilidade => ({
        probabilidade: this.transformToNumber(item.probabilidade),
        simbolo: item.simbolo,
      })
    );

    if (matrizCondicional.length !== simbolosEntrada.length)
      throw new AppError(
        400,
        "A matriz de probabilidades não possui a quantidade correta de linhas."
      );

    if (matrizCondicional[0].length !== simbolosSaida.length)
      throw new AppError(
        400,
        "A matriz de probabilidades não possui a quantidade correta de colunas."
      );

    if (
      matrizCondicional.filter((linha: number[]) => this.somatorio(linha) === 1)
        .length !== matrizCondicional.length
    )
      throw new AppError(
        400,
        "Há alguma linha na matriz com probabilidade resultante diferente de 1."
      );

    return res.status(200).send({
      success: true,
      message: "Operação realizada com sucesso.",
      content: this.exec({
        matrizCondicional,
        simbolosSaida,
        simbolosEntradaComProb,
      }),
    });
  };

  errorHandler = async (
    err: Error,
    _: Request,
    res: Response,
    __: NextFunction
  ): Promise<Response> => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Ocorreu um erro interno.",
    });
  };
}

export { Controller };

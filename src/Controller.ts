import { NextFunction, Request, Response } from "express";

import { AppError } from "./AppError";
import { IExec } from "./intefaces";
import { SimboloComProbabilidade } from "./types";

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

  private exec: IExec = ({ matriz, simbolosEntrada, simbolosSaida }) => {
    return {
      entropiaCondicionalSaida: 0,
      entropiaConjunta: 0,
      entropiaEntrada: 0,
      equivocacaoCanal: 0,
      informacaoMutuaMedia: 0,
    };
  };

  postRoute = async (req: Request, res: Response): Promise<Response> => {
    const {
      simbolos_entrada_com_prob: simbolosEntradaComProb,
      simbolos_saida: simbolosSaida,
      matriz_prob_condicional: matrizProbab,
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
      !simbolosEntradaComProb ||
      !Array.isArray(simbolosEntradaComProb) ||
      simbolosEntradaComProb.length < 2
    )
      throw new AppError(
        400,
        "O conjunto dos símbolos de entrada é obrigatório e deve ser um vetor com, no mínimo, dois elementos."
      );

    const matriz: number[][] = matrizProbab.map((linha: any) =>
      linha.map((coluna: any) => this.transformToNumber(coluna))
    );

    const simbolosEntrada = simbolosEntradaComProb.map(
      (item: any): SimboloComProbabilidade => ({
        probabilidade: this.transformToNumber(item.probabilidade),
        simbolo: item.simbolo,
      })
    );

    if (matriz.length !== simbolosEntrada.length)
      throw new AppError(
        400,
        "A matriz de probabilidades não possui a quantidade correta de linhas."
      );

    if (matriz[0].length !== simbolosSaida.length)
      throw new AppError(
        400,
        "A matriz de probabilidades não possui a quantidade correta de colunas."
      );

    return res.status(200).send(
      this.exec({
        matriz,
        simbolosSaida,
        simbolosEntrada,
      })
    );
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

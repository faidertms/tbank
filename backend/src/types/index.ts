import { Response } from "express";
import { Transaction } from "objection";
import { Model, NonFunctionPropertyNames } from "objection";

export interface IAtualizarSaldo {
    saldo: number;
    trx?: Transaction;
}

export interface ICriarConta {
    numero_identificador: number;
    saldo?: number;
    limite?: number;
    usuario_id: number
}

export interface ICriarUsuario {
    nome: string;
    cpf: string;
    telefone_celular: string;
    numero_da_conta: number;
};

export interface IEditarUsuario {
    id: number;
    nome?: string;
    cpf?: string;
    telefone_celular?: string;
};

export interface ICriarFavorecido extends ICriarUsuario {
    usuario_id: number;
}

export interface IEditarFavorecido extends IEditarUsuario {
    usuario_id: number;
}

export interface ICriarTransacao {
    valor: number;
    num_conta_de_origem: number;
    num_conta_de_destino: number;
    tipo_de_transacao: number;
    trx?: Transaction;
}

export interface ITransferirDinheiroEntreContas {
    valor: number;
    num_conta_de_origem: number;
    num_conta_de_destino: number;
    trx?: Transaction
}

export enum TiposDeTransacoesEnum {
    EnviarTransferencia = 1,
    ReceberTransferencia = 2,
    CancelarTransferencia = 3,
}

export interface IDownloadResponse {
    filePath: string;
    fileName: string;
    res: Response;
}

export interface IErrorHandlerResponse {
    message?: string | Array<string>;
    values?: object;
    code?: number;
    res: Response;
    error: any;
}

export interface ISendPaginateResponse {
    message: string | Array<string>;
    items?: Array<any>;
    code: number;
    res: Response;
}

export interface ISendResponse {
    data?: object | Array<any>;
    code: number;
    res: Response;
}

export interface IPaginate {
    limit?: number;
    offset?: number;
}

export type ModelObject<T extends Model> = Pick<
    T,
    Exclude<NonFunctionPropertyNames<T>, 'QueryBuilderType'>
>;

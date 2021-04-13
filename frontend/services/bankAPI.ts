import axios, { AxiosInstance, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
export type ErrorValue = {
    constraint?: Array<String>
    column?: Array<String>
}

export type Usuario = {
    id: number;
    nome: string;
    cpf: string;
    telefone_celular: string;
    criado_em: Date | string;
}

export type Conta = {
    numero_identificador: number;
    saldo: number;
    limite: number;
    usuario_id: number;
    criado_em: Date | string;
}

export type Transacao = {
    id: number;
    valor: number;
    num_conta_de_origem: number;
    num_conta_de_destino: number;
    tipo_de_transacao_id: number;
    data_hora: Date | string;
}

export type TipoDeTransacao = {
    id: number;
    descricao: string;
}

export type Favorecido = {
    id: number;
    nome: string;
    cpf: string;
    telefone_celular: string;
    usuario_id: number;
    numero_da_conta: number;
    criado_em: Date | string;
}

export enum TiposDeTransacoesEnum {
    EnviarTransferencia = 1,
    ReceberTransferencia = 2,
    CancelarTransferencia = 3,
}

const baseURL: string = process.env.NEXT_PUBLIC_BANKAPI ?? "http://backend:3001";
const usuarioId = 1;

export const usuarioApi: AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 240000,
    headers:
    {
        'Content-Type': 'application/json'
    },
});

axiosRetry(usuarioApi, { retries: 3 });

export const getUsuario = async (): Promise<AxiosResponse<Usuario>> => {
    const response = await usuarioApi.get<Usuario>(`/usuarios/${usuarioId}`);
    return response;
}

export const getContaDoUsuario = async (): Promise<AxiosResponse<Conta>> => {
    const response = await usuarioApi.get<Conta>(`/usuarios/${usuarioId}/conta`);
    return response;
}

export const getTransacoes = async (numero_da_conta: number): Promise<AxiosResponse<Transacao[]>> => {
    const response = await usuarioApi.get<Transacao[]>(`/contas/${numero_da_conta}/transacoes`);
    return response;
}

export const getTiposDeTransacoes = async (): Promise<AxiosResponse<TipoDeTransacao[]>> => {
    const response = await usuarioApi.get<TipoDeTransacao[]>(`/transacoes/tipos`);
    return response;
}


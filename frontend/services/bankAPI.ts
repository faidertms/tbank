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
    favorecido: Favorecido;
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


export type CreateFavorecidoRequest = {
    nome: string;
    cpf: string;
    telefone_celular: string;
    numero_da_conta: number;
}

export type UpdateFavorecidoRequest = {
    nome: string;
    telefone_celular: string;
}
export type TransferenciaEntreContas = {
    valor: number;
    num_conta_de_origem: number;
    num_conta_de_destino: number;
}

const baseURL: string = (process.env.BANKAPI_URL || process.env.NEXT_PUBLIC_BANKAPI_URL) ?? "http://backend:3001";
const usuarioId = 1;

export const bankApi: AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 240000,
    headers:
    {
        'Content-Type': 'application/json'
    },
});

axiosRetry(bankApi, { retries: 3 });

export const getUsuario = async (): Promise<AxiosResponse<Usuario>> => {
    const response = await bankApi.get<Usuario>(`/usuarios/${usuarioId}`);
    return response;
}

export const getContaDoUsuario = async (): Promise<AxiosResponse<Conta>> => {
    const response = await bankApi.get<Conta>(`/usuarios/${usuarioId}/conta`);
    return response;
}

export const getTransacoesDaConta = async (numero_da_conta: number): Promise<AxiosResponse<Transacao[]>> => {
    const response = await bankApi.get<Transacao[]>(`/contas/${numero_da_conta}/transacoes`);
    return response;
}

export const transferirValorEntreContas = async (data: TransferenciaEntreContas): Promise<AxiosResponse<Transacao>> => {
    const response = await bankApi.post<Transacao>(`/transacoes/transferencia-entre-contas`, data);
    return response;
}

export const getTiposDeTransacoes = async (): Promise<AxiosResponse<TipoDeTransacao[]>> => {
    const response = await bankApi.get<TipoDeTransacao[]>(`/transacoes/tipos`);
    return response;
}

export const getFavorecidosDoUsuario = async (): Promise<AxiosResponse<Favorecido[]>> => {
    const response = await bankApi.get<Favorecido[]>(`/usuarios/${usuarioId}/favorecidos`);
    return response;
}

export const getFavorecidoDoUsuarioPorId = async (favorecidoId: number): Promise<AxiosResponse<Favorecido>> => {
    const response = await bankApi.get<Favorecido>(`/usuarios/${usuarioId}/favorecidos/${favorecidoId}`);
    return response;
}
export const createFavorecidosDoUsuario = async (data: CreateFavorecidoRequest): Promise<AxiosResponse<Favorecido>> => {
    const response = await bankApi.post<Favorecido>(`/usuarios/${usuarioId}/favorecidos`, data);
    return response;
}

export const updateFavorecidosDoUsuario = async (favorecidoId: number, data: UpdateFavorecidoRequest): Promise<AxiosResponse<undefined>> => {
    const response = await bankApi.put<undefined>(`/usuarios/${usuarioId}/favorecidos/${favorecidoId}`, data);
    return response;
}

export const deleteFavorecidosDoUsuario = async (favorecidoId: number): Promise<AxiosResponse<undefined>> => {
    const response = await bankApi.delete<undefined>(`/usuarios/${usuarioId}/favorecidos/${favorecidoId}`);
    return response;
}




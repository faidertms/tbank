import { Transaction } from "objection";
import Conta from "../models/Conta";
import { IAtualizarSaldo, ICriarConta } from "../types";

export async function getContaPorNumeroIdentificador(numero_identificador: number, trx?: Transaction): Promise<Conta> {
    const conta = await Conta.query(trx).findById(numero_identificador).throwIfNotFound({
        message: `Conta não encontrada: ${numero_identificador}`
    });
    return conta;
};

export async function verificarSeContaExiste(numero_identificador: number, trx?: Transaction): Promise<boolean> {
    try {
        await getContaPorNumeroIdentificador(numero_identificador, trx);
        return true;
    } catch (error) {
        return false;
    }
};

export async function getContaDoUsuario(usuario_id: number): Promise<Conta> {
    const conta = await Conta.query().where({ usuario_id }).first().throwIfNotFound({
        message: `Conta não encontrada do Usuário: ${usuario_id}`
    });
    return conta;
};

export async function criarConta({
    numero_identificador,
    saldo = 500,
    limite = 500,
    usuario_id
}: ICriarConta): Promise<Conta> {
    //Toda conta seja do usuario ou do favorecido terá saldo e limite de 500
    const conta = await Conta.query().insert({
        numero_identificador,
        saldo,
        limite,
        usuario_id
    });
    return conta;
};

export async function atualizarSaldoDaConta(numero_identificador: number, {
    saldo,
    trx,
}: IAtualizarSaldo): Promise<Conta> {
    const conta = await Conta.query(trx).patchAndFetchById(numero_identificador, {
        saldo
    }).throwIfNotFound({
        message: `Conta não encontrada: ${numero_identificador}`
    });
    return conta;
};
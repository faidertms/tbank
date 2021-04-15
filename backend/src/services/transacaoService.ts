import { Transaction } from "objection";
import TransferenciaRecusadaError from "../errors/TransferenciaRecusadaError";
import TipoDeTransacao from "../models/TipoDeTransacao";
import Transacao from "../models/Transacao";
import { ICriarTransacao, ITransferirDinheiroEntreContas, TiposDeTransacoesEnum } from "../types";
import { atualizarSaldoDaConta, getContaDoUsuario, getContaPorNumeroIdentificador, } from "./contaService";
import { v4 as uuidv4 } from 'uuid';

export async function getTransacaoPorId(id: number): Promise<Transacao> {
    const transacao = await Transacao.query().findById(id).throwIfNotFound({
        message: `Transação não encontrada: ${id}`
    });
    return transacao;
};

export async function getTiposDeTransacoes(): Promise<TipoDeTransacao[]> {
    const tiposDeTransacoes = await TipoDeTransacao.query();
    return tiposDeTransacoes;
};

export async function getTransacoesDaConta(numero_da_conta: number): Promise<Transacao[]> {
    const transacoes = await Transacao.query()
        .where({
            num_conta_de_origem: numero_da_conta,
            tipo_de_transacao_id: TiposDeTransacoesEnum.EnviarTransferencia
        })
        .orWhere({
            num_conta_de_destino: numero_da_conta,
            tipo_de_transacao_id: TiposDeTransacoesEnum.ReceberTransferencia
        })
        .orWhere(function () {
            this.where({
                num_conta_de_origem: numero_da_conta,
                tipo_de_transacao_id: TiposDeTransacoesEnum.CancelarTransferencia
            }).orWhere({
                num_conta_de_destino: numero_da_conta,
                tipo_de_transacao_id: TiposDeTransacoesEnum.CancelarTransferencia
            })
        })
        .withGraphFetched('favorecido')
        .orderBy('data_hora', 'desc');
    return transacoes;
};

export async function getTransacoesDoUsuario(usuario_id: number): Promise<Transacao[]> {
    //TODO - pode ser feito um inner join para otimizar...
    const conta = await getContaDoUsuario(usuario_id);
    const transacoes = await getTransacoesDaConta(conta.numero_identificador);
    return transacoes;
};

export async function criarTransacao({
    valor,
    num_conta_de_origem,
    num_conta_de_destino,
    numero_autenticacao,
    tipo_de_transacao,
    trx,
}: ICriarTransacao) {
    const transacao = await Transacao.query(trx).insert({
        valor,
        num_conta_de_origem,
        num_conta_de_destino,
        numero_autenticacao,
        tipo_de_transacao_id: tipo_de_transacao,
    });
    return transacao;
};


async function cancelarMesmaTransacaoFeitaEmDoisMinutos({
    valor,
    num_conta_de_origem,
    num_conta_de_destino,
    trx
}: ITransferirDinheiroEntreContas
): Promise<boolean> {
    await Transacao.query(trx).delete()
        .whereRaw("data_hora + interval '2 minute' > now()")
        .where({
            tipo_de_transacao_id: TiposDeTransacoesEnum.ReceberTransferencia,
            valor,
            num_conta_de_origem,
            num_conta_de_destino
        });
    const qtdTransacoesAtualizada = await Transacao.query(trx)
        .patch({ tipo_de_transacao_id: TiposDeTransacoesEnum.CancelarTransferencia })
        .whereRaw("data_hora + interval '2 minute' > now()")
        .where({
            valor,
            num_conta_de_origem,
            num_conta_de_destino
        });
    return qtdTransacoesAtualizada > 0;
}

export async function transferirDinheiroEntreContas({
    valor,
    num_conta_de_origem,
    num_conta_de_destino
}: ITransferirDinheiroEntreContas): Promise<Transacao> {
    //Assumir que a transferencia é entre contas do mesmo banco, logo gera transação de entrada e saida na mesma função
    const trx = await Transacao.startTransaction();
    try {
        //Se Existe transação para a mesma conta e com o mesmo valor nos ultimos dois minutos deve ser cancelado a ultima transferencia
        const foiCanceladaTransacao = await cancelarMesmaTransacaoFeitaEmDoisMinutos({
            valor,
            num_conta_de_origem,
            num_conta_de_destino,
            trx
        });

        const contaDeOrigem = await getContaPorNumeroIdentificador(num_conta_de_origem);
        const contaDeDestino = await getContaPorNumeroIdentificador(num_conta_de_destino);
        const numero_autenticacao = uuidv4();

        //Envio da transferencia
        //Se o valor for maior que o saldo logo é preciso verificar o limite dele para poder fazer a transferencia
        if ((contaDeOrigem.limite + contaDeOrigem.saldo) < valor) {
            throw new TransferenciaRecusadaError("Conta sem saldo e limite para fazer a transferência!", contaDeOrigem.numero_identificador);
        }

        const transacaoEnviada = await criarTransacao({
            valor,
            num_conta_de_origem,
            num_conta_de_destino,
            numero_autenticacao,
            tipo_de_transacao: TiposDeTransacoesEnum.EnviarTransferencia,
            trx
        });

        //Recebimento da transferencia
        //Como vem do mesmo banco é inserido a informação logo em seguida
        const transacaoRecebida = await criarTransacao({
            valor,
            num_conta_de_origem,
            num_conta_de_destino,
            numero_autenticacao,
            tipo_de_transacao: TiposDeTransacoesEnum.ReceberTransferencia,
            trx
        });

        //Atualizar Saldo das contas
        //Caso tenha sido cancelada a última transferencia para manter a nova não é atualizar o saldo pois é o mesmo valor
        if (!foiCanceladaTransacao) {
            const novoSaldoDaContaDeOrigem = contaDeOrigem.saldo - valor;
            await atualizarSaldoDaConta(contaDeOrigem.numero_identificador, { saldo: novoSaldoDaContaDeOrigem, trx });

            const novoSaldoDaContaDeDestino = contaDeDestino.saldo + valor;
            await atualizarSaldoDaConta(contaDeDestino.numero_identificador, { saldo: novoSaldoDaContaDeDestino, trx });
        }

        await trx.commit();
        return transacaoEnviada;
    } catch (err) {
        await trx.rollback();
        throw err
    }

};
import styles from './style.module.css'
import { formatValueNumeric } from '../../helpers/functions';
import { Conta, TipoDeTransacao, TiposDeTransacoesEnum, Transacao } from '../../services/bankAPI';

interface Props {
    conta: Conta
    transacoes: Transacao[];
    tiposDeTransacoes: TipoDeTransacao[];
}

export default function TransacaoList({
    conta,
    transacoes,
    tiposDeTransacoes
}: Props): JSX.Element {
    const defineTransacaoClass = (transacao: Transacao) => {
        const transacaoCanceladaClass = transacao.tipo_de_transacao_id === TiposDeTransacoesEnum.CancelarTransferencia
            ? styles.transacaoCancelada
            : '';
        const sinalDaTransacao = transacao.num_conta_de_origem === conta.numero_identificador
            ? styles.transacaoEnviada
            : styles.transacaoRecebida;

        return `${sinalDaTransacao} ${transacaoCanceladaClass}`
    }

    const formatValorTransacao = (transacao: Transacao) => {
        return transacao.num_conta_de_origem === conta.numero_identificador
            ? `- ${formatValueNumeric(transacao.valor, 'money', 2)}`
            : `+ ${formatValueNumeric(transacao.valor, 'money', 2)}`;
    }

    return (
        <div className={styles.transacoesList} >
            {transacoes.map(transacao => {
                const tipoDeTransacao = tiposDeTransacoes.find(tipo => (tipo.id === transacao.tipo_de_transacao_id));
                return (
                    <div className={styles.transacaoCard} >
                        <div className={styles.transacaoDetalhe}>
                            <span className={styles.tipoTrasancao}>
                                {tipoDeTransacao?.descricao}
                            </span>
                            <span className={`${styles.valorTransacao} ${defineTransacaoClass(transacao)}`}>
                                {formatValorTransacao(transacao)}
                            </span>
                        </div>
                        <div className={styles.dataTransacao} >
                            <span>
                                {new Date(transacao.data_hora).toLocaleString()}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
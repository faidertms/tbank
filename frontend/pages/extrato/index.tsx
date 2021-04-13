import HomeLayout from '../../layouts/Home';
import { UsuarioContextProvider, IUsuarioContext } from '../../contexts/Usuario';
import AccountDetails from '../../components/AccountDetails';
import { GetServerSideProps } from 'next';
import { getContaDoUsuario, getUsuario, getTransacoes, getTiposDeTransacoes, TipoDeTransacao, Transacao } from '../../services/bankAPI';
import styles from './style.module.css'
import TransacaoList from '../../components/TransacaoList';

interface Props extends IUsuarioContext {
  transacoes: Transacao[];
  tiposDeTransacoes: TipoDeTransacao[];
}



export default function Extrato({ conta, usuario, transacoes, tiposDeTransacoes }: Props): JSX.Element {
  //Conta e Usuario vem via server-side


  return (
    <UsuarioContextProvider conta={conta} usuario={usuario}>
      <HomeLayout>
        <AccountDetails />
        {transacoes.length > 0
          ? (
            <TransacaoList
              conta={conta}
              transacoes={transacoes}
              tiposDeTransacoes={tiposDeTransacoes}
            />
          ) : (
            <div className={styles.listaVazia}>
              Sem Transações
            </div>
          )
        }
      </HomeLayout>
    </UsuarioContextProvider>
  )
}





export const getServerSideProps: GetServerSideProps = async (context) => {
  const [usuarioResponse, contaResponse] = await Promise.all([getUsuario(), getContaDoUsuario()]);
  const [transacoesResponse, tiposDeTransacoesResponse] = await Promise.all([getTransacoes(contaResponse.data.numero_identificador), getTiposDeTransacoes()]);

  console.log({
    usuario: usuarioResponse.data,
    conta: contaResponse.data,
    transacoes: transacoesResponse.data,
    tiposDeTransacoes: tiposDeTransacoesResponse.data
  })
  return {
    props: {
      usuario: usuarioResponse.data,
      conta: contaResponse.data,
      transacoes: transacoesResponse.data,
      tiposDeTransacoes: tiposDeTransacoesResponse.data
    },
  }
}
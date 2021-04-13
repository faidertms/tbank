import ActionGrid from '../components/ActionGrid';
import HomeLayout from '../layouts/Home';
import { UsuarioContextProvider, IUsuarioContext } from '../contexts/Usuario';
import AccountDetails from '../components/AccountDetails';
import { GetServerSideProps } from 'next';
import { getContaDoUsuario, getUsuario } from '../services/bankAPI';

interface Props extends IUsuarioContext {

}

export default function Home({ conta, usuario }: Props): JSX.Element {
  //Conta e Usuario vem via server-side
  return (
    <UsuarioContextProvider conta={conta} usuario={usuario}>
      <HomeLayout>
        <AccountDetails />
        <ActionGrid />
      </HomeLayout>
    </UsuarioContextProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [usuarioResponse, contaResponse] = await Promise.all([getUsuario(), getContaDoUsuario()]);
  console.log({
    usuario: usuarioResponse.data,
    conta: contaResponse.data
  })
  return {
    props: {
      usuario: usuarioResponse.data,
      conta: contaResponse.data
    },
  }
}
import React, { useState } from 'react';
import FavorecidoCard from '../../components/FavorecidoCard'
import styles from './style.module.css'
import HomeLayout from '../../layouts/Home';
import { IUsuarioContext, UsuarioContextProvider } from '../../contexts/Usuario';
import AccountDetails from '../../components/AccountDetails';
import Loader from '../../components/Loader';
import { deleteFavorecidosDoUsuario, Favorecido, getContaDoUsuario, getFavorecidosDoUsuario, getUsuario } from '../../services/bankAPI';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router'
import { BiPlus } from 'react-icons/bi';


interface Props extends IUsuarioContext {
    favorecidos: Favorecido[];
}

export default function Home({ conta, usuario, favorecidos }: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const deleteFavorecido = async (id: number) => {
        setIsLoading(true);
        await deleteFavorecidosDoUsuario(id);
        router.reload();
    }

    const createFavorecido = async () => {
        setIsLoading(true);
        router.push(`/favorecidos/create`);
    }

    return (
        <UsuarioContextProvider conta={conta} usuario={usuario}>
            <HomeLayout>
                <Loader isLoading={isLoading} />
                <AccountDetails />
                <button className={styles.createButton} onClick={createFavorecido}>
                    <BiPlus size="20" /> <span>Adicionar</span>
                </button>
                <div className={styles.favorecidosGrid} >
                    {favorecidos.map((favorecido: Favorecido) => {
                        return <FavorecidoCard {...favorecido} deleteFavorecido={deleteFavorecido} key={favorecido.id} />
                    })}
                </div>
            </HomeLayout>
        </UsuarioContextProvider >
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const [usuarioResponse, contaResponse] = await Promise.all([getUsuario(), getContaDoUsuario()]);
    const favorecidosResponse = await getFavorecidosDoUsuario();

    console.log({
        usuario: usuarioResponse.data,
        conta: contaResponse.data,
        favorecidos: favorecidosResponse.data,
    })

    return {
        props: {
            usuario: usuarioResponse.data,
            conta: contaResponse.data,
            favorecidos: favorecidosResponse.data,
        },
    }
}
import { FormEvent, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { cellPhoneMask, cpfMask, onlyNumber } from '../../../../helpers/functions';
import HomeLayout from '../../../../layouts/Home';
import { IUsuarioContext, UsuarioContextProvider } from '../../../../contexts/Usuario';
import AccountDetails from '../../../../components/AccountDetails';
import {
    updateFavorecidosDoUsuario,
    Favorecido,
    getContaDoUsuario,
    getUsuario,
    getFavorecidoDoUsuarioPorId
} from '../../../../services/bankAPI';
import Loader from '../../../../components/Loader';
import { toast, ToastContainer } from "react-toastify";
import styles from './style.module.css'
import { useRouter } from 'next/router'
import 'react-toastify/dist/ReactToastify.css';

interface Props extends IUsuarioContext {
    favorecido: Favorecido;
}

interface FormData {
    nome: string,
    telefone_celular: string,
}

export default function edit({ favorecido, usuario, conta }: Props): JSX.Element {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFormValid, setIsFormValid] = useState<boolean>(true);
    const [formData, setFormData] = useState<FormData>({
        nome: favorecido.nome,
        telefone_celular: cellPhoneMask(favorecido.telefone_celular)
    });

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await updateFavorecidosDoUsuario(favorecido.id, {
                nome: formData.nome,
                telefone_celular: onlyNumber(formData.telefone_celular),
            });
            toast.success('Salvo com sucesso!', {
                position: "bottom-right",
                autoClose: 3000,
            });
            setTimeout(() => router.push('/favorecidos'), 3000);
        } catch (error) {
            const message: string = error.response ? error.response.data.message : "Server Offline";
            toast.error(message, {
                position: "bottom-right",
                autoClose: 5000,
            });
            setIsLoading(false);
        }

    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        let newValue: any = value;
        switch (name) {
            case "telefone_celular":
                newValue = cellPhoneMask(value);
                break;
            default:
                break;
        }
        setFormData((prevForm) => ({ ...prevForm, [name]: newValue }));
    }

    useEffect(() => {
        setIsFormValid(formData.telefone_celular.length >= 15 && formData.nome.length >= 2);
    }, [formData])

    return (
        <UsuarioContextProvider conta={conta} usuario={usuario}>
            <HomeLayout>
                <Loader isLoading={isLoading} />
                <AccountDetails />
                <div className={styles.formCard}>
                    <div className={styles.formTitle}>Editar Favorecido</div>
                    <form onSubmit={handleSubmit}>
                        <label>Nome</label>
                        <input name="nome" type="text" onChange={handleChange} value={formData.nome} />
                        <label>CPF</label>
                        <input name="cpf" type="text" onChange={handleChange} value={cpfMask(favorecido.cpf)} disabled />
                        <label>Celular</label>
                        <input name="telefone_celular" type="text" onChange={handleChange} value={formData.telefone_celular} />
                        <label>Conta</label>
                        <input name="numero_da_conta" type="text" onChange={handleChange} value={favorecido.numero_da_conta} disabled />
                        <button className={styles.formSubmit} disabled={!isFormValid}> Salvar </button>
                    </form>
                </div>
                <ToastContainer />
            </HomeLayout>
        </UsuarioContextProvider>
    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const [usuarioResponse, contaResponse] = await Promise.all([getUsuario(), getContaDoUsuario()]);
    const favorecidoResponse = await getFavorecidoDoUsuarioPorId(Number(context.query.id ?? 0));

    console.log({
        usuario: usuarioResponse.data,
        conta: contaResponse.data,
        favorecido: favorecidoResponse.data,
    })

    return {
        props: {
            usuario: usuarioResponse.data,
            conta: contaResponse.data,
            favorecido: favorecidoResponse.data,
        },
    }
}
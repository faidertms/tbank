import { FormEvent, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { cellPhoneMask, cpfMask, onlyNumber } from '../../../helpers/functions';
import HomeLayout from '../../../layouts/Home';
import { IUsuarioContext, UsuarioContextProvider } from '../../../contexts/Usuario';
import AccountDetails from '../../../components/AccountDetails';
import Loader from '../../../components/Loader';
import { toast, ToastContainer } from "react-toastify";
import styles from './style.module.css'
import { useRouter } from 'next/router'
import 'react-toastify/dist/ReactToastify.css';
import {
    getContaDoUsuario,
    getUsuario,
    createFavorecidosDoUsuario
} from '../../../services/bankAPI';

interface Props extends IUsuarioContext {
}

interface FormData {
    nome: string,
    cpf: string,
    telefone_celular: string,
    numero_da_conta: string
}

export default function create({ usuario, conta }: Props): JSX.Element {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFormValid, setIsFormValid] = useState<boolean>(true);
    const [formData, setFormData] = useState<FormData>({
        nome: "",
        cpf: "",
        telefone_celular: "",
        numero_da_conta: "",
    });

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await createFavorecidosDoUsuario({
                nome: formData.nome,
                cpf: onlyNumber(formData.cpf),
                telefone_celular: onlyNumber(formData.telefone_celular),
                numero_da_conta: Number(onlyNumber(formData.numero_da_conta))
            });
            toast.success('Salvo com sucesso!', {
                position: "bottom-right",
                autoClose: 3000,
            });
            setTimeout(() => router.push('/favorecidos'), 3000);
        } catch (error) {
            console.log(error?.response)
            let message: string = error.response ? error.response.data.message : "Server Offline";
            if (error?.response.status == 409) {
                message = error?.response.data.values.columns.find((column: string) => column === 'numero_da_conta')
                    ? "Numero da conta já existe!"
                    : "CPF do Favorecido já existe";
            }
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
            case "cpf":
                newValue = cpfMask(value)
                break;
            case "telefone_celular":
                newValue = cellPhoneMask(value);
                break;
            case "numero_da_conta":
                newValue = onlyNumber(value);
                break;
            default:
                break;
        }
        setFormData((prevForm) => ({ ...prevForm, [name]: newValue }));
    }

    useEffect(() => {
        // Contando com a mascara
        setIsFormValid(
            formData.telefone_celular.length >= 15
            && formData.nome.length >= 2
            && formData.cpf.length >= 14
            && formData.numero_da_conta.length > 0
        );
    }, [formData])

    return (
        <UsuarioContextProvider conta={conta} usuario={usuario}>
            <HomeLayout>
                <Loader isLoading={isLoading} />
                <AccountDetails />
                <div className={styles.formCard}>
                    <div className={styles.formTitle}>Criar Favorecido</div>
                    <form onSubmit={handleSubmit}>
                        <label>Nome</label>
                        <input name="nome" type="text" onChange={handleChange} value={formData.nome} />
                        <label>CPF</label>
                        <input name="cpf" type="text" onChange={handleChange} value={formData.cpf} />
                        <label>Celular</label>
                        <input name="telefone_celular" type="text" onChange={handleChange} value={formData.telefone_celular} />
                        <label>Conta</label>
                        <input name="numero_da_conta" type="text" onChange={handleChange} value={formData.numero_da_conta} />
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

    console.log({
        usuario: usuarioResponse.data,
        conta: contaResponse.data,
    })

    return {
        props: {
            usuario: usuarioResponse.data,
            conta: contaResponse.data,
        },
    }
}
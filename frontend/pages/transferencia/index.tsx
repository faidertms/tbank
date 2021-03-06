import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import HomeLayout from '../../layouts/Home';
import { UsuarioContextProvider, IUsuarioContext } from '../../contexts/Usuario';
import AccountDetails from '../../components/AccountDetails';
import ModalConfirm from '../../components/Modal/Confirm';
import { GetServerSideProps } from 'next';
import { Favorecido, getContaDoUsuario, getFavorecidoDoUsuarioPorId, getUsuario, transferirValorEntreContas } from '../../services/bankAPI';
import styles from './style.module.css';
import Link from 'next/link';
import Loader from '../../components/Loader';
import { moneyMask, moneyMaskToNumber } from '../../helpers/functions';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';

interface Props extends IUsuarioContext {
    favorecido: Favorecido | null;
}

interface ModalData {
    isOpen: boolean,
    title: string,
    message: string,
}

export default function Transferencia({ conta, usuario, favorecido }: Props): JSX.Element {
    const router = useRouter();
    const [modalData, setModalData] = useState<ModalData>({ isOpen: false, title: "", message: "" });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFormValid, setIsFormValid] = useState<boolean>(true);
    const [valorTransferencia, setValorTransferencia] = useState<string>('');

    useEffect(() => {
        setIsFormValid(
            (moneyMaskToNumber(valorTransferencia) > 0)
            && favorecido !== null
        );
    }, [valorTransferencia])

    const closeModal = () => {
        setModalData(prevState => ({ ...prevState, isOpen: false }));
    }

    const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = moneyMask(event.target.value);
        setValorTransferencia(newValue)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (conta.saldo >= moneyMaskToNumber(valorTransferencia)) {
            setModalData({
                title: "Transfer??ncia",
                message: "Deseja continuar?",
                isOpen: true
            });
        } else {
            setModalData({
                title: "Transfer??ncia acima do saldo",
                message: "Valor da transfer??ncia ?? maior que o saldo dispon??vel da sua conta logo ser?? usado o limite para complementar. Deseja continuar?",
                isOpen: true
            });
        }
    }

    const transferirValor = async (): Promise<void> => {
        closeModal();
        setIsLoading(true);
        try {
            await transferirValorEntreContas({
                valor: moneyMaskToNumber(valorTransferencia),
                num_conta_de_origem: conta.numero_identificador,
                num_conta_de_destino: favorecido?.numero_da_conta ?? -1
            });
            toast.success('Transfer??ncia feita com sucesso!', {
                position: "bottom-right",
                autoClose: 3000,
            });
            setTimeout(() => router.push('/extrato'), 3000);
        } catch (error) {
            let message: string = error.response ? error.response.data.message : "Server Offline";
            toast.error(message, {
                position: "bottom-right",
                autoClose: 5000,
            });
            setIsLoading(false);
        }
    }


    return (
        <UsuarioContextProvider conta={conta} usuario={usuario}>
            <HomeLayout>
                <Loader isLoading={isLoading} />
                <AccountDetails />
                <div className={styles.transferenciaCard}>
                    <p>Favorecido: <span>{favorecido?.nome ?? "N??o selecionado"}</span></p>
                    <p>CPF: <span>{favorecido?.cpf ?? "N??o selecionado"}</span></p>
                    <p>Conta: <span>{favorecido?.numero_da_conta ?? "N??o selecionado"}</span></p>
                    <div className={styles.favorecidoLink}>
                        <Link href="/favorecidos">
                            {favorecido ? "Mudar Favorecido" : "Selecionar Favorecido"}
                        </Link>
                    </div>
                    <div className={styles.transferenciaValue}>
                        <form onSubmit={handleSubmit}>
                            <label>Valor(R$)</label>
                            <input
                                type="text"
                                value={valorTransferencia}
                                onChange={onChangeValue}
                                disabled={favorecido === null}
                                required
                            />
                            <button className={styles.formSubmit} disabled={!isFormValid}> Transferir </button>
                        </form>
                    </div>
                </div>
                <ToastContainer />
                <ModalConfirm
                    {...modalData}
                    onClose={closeModal}
                    submitForm={transferirValor}
                />
            </HomeLayout>
        </UsuarioContextProvider>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const favorecidoId = Array.isArray(context.query.favorecidoId)
        ? context.query.favorecidoId[0]
        : context.query.favorecidoId;

    const [usuarioResponse, contaResponse] = await Promise.all([getUsuario(), getContaDoUsuario()]);
    const favorecidoResponse = context.query.favorecidoId ? await getFavorecidoDoUsuarioPorId(Number(favorecidoId ?? '0')) : undefined;

    return {
        props: {
            usuario: usuarioResponse.data,
            conta: contaResponse.data,
            favorecido: favorecidoResponse?.data || null
        },
    }
}
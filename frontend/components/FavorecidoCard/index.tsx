
import Link from 'next/link';
import React from 'react';
import styles from './style.module.css'
import { Favorecido } from '../../services/bankAPI';
import { cellPhoneMask, cpfMask } from '../../helpers/functions';

type Props = Favorecido & {
    deleteFavorecido: (id: number) => void
};

export default function FilialCard({
    id,
    nome,
    cpf,
    telefone_celular,
    numero_da_conta,
    deleteFavorecido
}: Props): JSX.Element {
    return (

        <div className={styles.favorecidoItem}>
            <div className={styles.tituloFavorecidoItem}>{nome}</div>
            <p >CPF: {cpfMask(cpf)}</p>
            <p >Telefone: {cellPhoneMask(telefone_celular)}</p>
            <p >Conta: {numero_da_conta}</p>

            <p className={styles.buttonGroupFavorecidoItem}>
                <Link href={{ pathname: "/transferencia", query: { favorecidoId: id } }}  >
                    Transferir
                </Link>

                <Link href="/favorecidos/[id]/edit" as={`/favorecidos/${id}/edit`} >
                    Editar
                </Link>

                <button onClick={() => deleteFavorecido(id)}>
                    Deletar
                </button>
            </p>
        </div>
    )
}

import { useContext } from 'react';
import { UsuarioContext } from '../../contexts/Usuario';
import { formatValueNumeric } from '../../helpers/functions';
import styles from './style.module.css';

export default function AccountDetails() {
    const { conta } = useContext(UsuarioContext);
    const saldoNegativoClass = conta.saldo < 0 ? styles.saldoNegativo : undefined;
    return (
        <div className={styles.accountDetails}>

            <p>
                {"Saldo: "}
                <span className={saldoNegativoClass}>
                    {formatValueNumeric(conta.saldo, 'money', 2)}
                </span>
            </p>
            <p>
                {"Limite: "}
                <span>
                    {formatValueNumeric(conta.limite, 'money', 2)}
                </span>
            </p>

        </div>
    )
}
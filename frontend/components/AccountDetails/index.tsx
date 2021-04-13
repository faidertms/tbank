
import { useContext } from 'react';
import { UsuarioContext } from '../../contexts/Usuario';
import { formatValueNumeric } from '../../helpers/functions';
import styles from './style.module.css';

export default function AccountDetails() {
    const { conta } = useContext(UsuarioContext);
    return (
        <div className={styles.accountDetails}>
            <div>
                Saldo: {formatValueNumeric(conta.saldo, 'money', 2)}
            </div>
        </div>
    )
}
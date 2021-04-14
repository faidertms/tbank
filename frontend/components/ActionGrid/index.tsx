
import styles from './style.module.css';
import ActionItem from './ActionItem';
import { BiReceipt, BiTransferAlt } from 'react-icons/bi';
import { RiContactsBookUploadLine } from 'react-icons/ri';

export default function ActionGrid(): JSX.Element {

    return (
        <div className={styles.actionGrid} >
            <ActionItem url={"/extrato"}>
                <div>
                    <BiReceipt />
                    <div>Extrato</div>
                </div>
            </ActionItem>

            <ActionItem url={"/favorecidos"}>
                <div>
                    <RiContactsBookUploadLine />
                    <div>Favorecidos</div>
                </div>
            </ActionItem>

            <ActionItem url={"/transferencia"}>
                <div>
                    <BiTransferAlt />
                    <div>Transferência</div>
                </div>
            </ActionItem>

            
        </div>
    )
}
import React from "react";
import Modal from "..";
import styles from "./style.module.css";

interface Props {
    onClose: () => void;
    submitForm: () => void;
    isOpen: boolean;
    message: string;
    title: string;
}

export default function ModalConfirm({ onClose, isOpen, submitForm, title, message }: Props): JSX.Element {
    console.log(isOpen)
    return (
        <Modal onClose={onClose} isOpen={isOpen} title={title}>
            <div>
                <div>
                    {message}
                </div>
                <div className={styles.submitDiv}>
                    <button className={styles.confirmButton} type="submit" onClick={submitForm}>
                        Continuar
                    </button>

                    <button className={styles.cancelButton} type="submit" onClick={onClose} >
                        Cancelar
                    </button>
                </div>
            </div>
        </Modal>
    );
}

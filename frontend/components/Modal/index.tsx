import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./style.module.css";

interface Props {
    onClose: () => void,
    isOpen: boolean,
    title: string,
    children: React.ReactNode,
}

export default function Modal ({ onClose, isOpen, children, title }: Props): JSX.Element {
    return isOpen ? (
        <div className={`${styles.modal} ${!isOpen ? styles.off : ''} `}>
            <div className={styles.dialog}>
                <div className={styles.header}>
                    <p>{title}</p>
                    <button className={styles.closeButton} onClick={onClose}>
                        <AiOutlineClose />
                    </button>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    ) : <></>;
}

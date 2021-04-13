import React from 'react';
import styles from './style.module.css';

interface Props {
    isLoading: boolean
}
export default function index({ isLoading }: Props): JSX.Element {
    return isLoading ? (
        <div className={styles.wrapper}>
            <div className={styles.ldsgrid}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    ) : (<></>);
}

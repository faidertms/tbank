import React, { Fragment } from 'react';
import Header from './Header';
import styles from './style.module.css'

interface Props {
    children: JSX.Element | Array<JSX.Element>;
}

export default function home({ children }: Props): JSX.Element {
    return (
        <Fragment>
            <Header />
            <main className={styles.main} >
                {children}
            </main>

            <footer>

            </footer>
        </Fragment>
    )
}
import React from 'react';
import Head from 'next/head';
import styles from './style.module.css';
import Link from 'next/link';

export default function Header(): JSX.Element {
    return (
        <header className={styles.header}>
            <Head>
                <title>TBank</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <nav>
                <div className={styles.logo}>
                    <Link href="/">
                        <span> TBank </span>
                    </Link>
                </div>
            </nav>
        </header>
    );
}

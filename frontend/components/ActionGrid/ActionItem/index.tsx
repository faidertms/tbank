
import styles from './style.module.css';
import Link from 'next/link';

interface Props {
    // selected: boolean,
    // setSelected: (id: number) => void,
    url: string;
    children: React.ReactNode;
}

export default function ActionItem({
    url,
    children
}: Props): JSX.Element {
    return (
        <Link href={url}>
            <div className={styles.actionItem}>
                <div className={styles.actionContent}>
                    {children}
                </div>
            </div>
        </Link>
    )
}
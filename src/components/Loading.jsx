import React from 'react'
import styles from './Header.module.css'

export default function Loading() {
    return (
        <div className={styles.blockLoader}>
            Загрузка данных <div className={styles.loader}></div>
        </div>
    )
}

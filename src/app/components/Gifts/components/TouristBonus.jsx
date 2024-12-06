import React from 'react'
import styles from '../Gifts.module.css';

export default function TouristBonus() {
    return (
        <div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th scope="col">Филиал</th>
                        <th scope="col">Номер</th>
                        <th scope="col">ФИО</th>
                        <th scope="col">ID документа</th>
                        <th scope="col">Дата</th>
                        <th scope="col">Статусные</th>
                        <th scope="col">Спонсорские</th>
                        <th scope="col">Итого</th>
                        <th scope="col">ИП</th>
                        <th scope="col">Соц фонд</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td scope="row">S01</td>
                        <td>Бишкек</td>
                        <td>нет</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

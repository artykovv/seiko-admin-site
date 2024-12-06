import React from 'react'
import styles from '../Bonuses.module.css';

export default function BinaryCheck() {
    return (
        <div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th scope="col">Филиал</th>
                        <th scope="col">Номер</th>
                        <th scope="col">ФИО</th>
                        <th scope="col">ID документа</th>
                        <th scope="col">Месяц</th>
                        <th scope="col">Бинар</th>
                        <th scope="col">Чек</th>
                        <th scope="col">Итого</th>
                        <th scope="col">ИП</th>
                        <th scope="col">Соц фонд</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td scope="row">Seiko</td>
                        <td>S0100000</td>
                        <td>Global Company Seiko</td>
                        <td>null</td>
                        <td>Не указано</td>
                        <td>8</td>
                        <td>0</td>
                        <td>8</td>
                        <td>нет</td>
                        <td>нет</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

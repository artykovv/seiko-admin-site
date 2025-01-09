'use client'
import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import axios from 'axios';
import { API_URL } from '@/api/api';


function Home() {
    const [data, setData] = useState({
        packages: [],
        statuses: [],
        turnovers: [],
        binar: [],
        ref: [],
        statusTotal: [],
        sponsor: [],
        total: []
    });

    const fetchData = async (endpoint, key) => {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/api/v1/${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = response.data || [];
        setData(prevData => ({ ...prevData, [key]: result }));
    };

    useEffect(() => {
        const keys = [
            { endpoint: 'paket_counts', key: 'packages' },
            { endpoint: 'status_counts', key: 'statuses' },
            { endpoint: 'turnovers/total', key: 'turnovers' },
            { endpoint: 'binar/total', key: 'binar' },
            { endpoint: 'ref/total', key: 'ref' },
            { endpoint: 'status/total', key: 'statusTotal' },
            { endpoint: 'sponsor/total', key: 'sponsor' },
            { endpoint: 'total', key: 'total' }
        ];

        const fetchDataIfNeeded = async () => {
            await Promise.all(keys.map(({ endpoint, key }) => {
                const cachedData = localStorage.getItem(key);
                if (!cachedData || JSON.parse(cachedData).length === 0) {
                    return fetchData(endpoint, key);
                } else {
                    setData(prevData => ({ ...prevData, [key]: JSON.parse(cachedData) }));
                }
            }));
        };

        fetchDataIfNeeded();
    }, []);


    return (
        <div className={styles.homeContainer}>
            <div className={styles.homeTitle}>
                <h1>Главная</h1>
            </div>
            <div className={styles.tableSection}>
                <div className={styles.tableWrapper} style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className={styles.tableIn}>
                        <h3>Пакеты</h3>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th scope="col">Пакеты</th>
                                    <th scope="col">За все время</th>
                                    <th scope="col">За текущий месяц</th>
                                </tr>
                            </thead>
                            <tbody className={styles.homeTbody}>
                                {data.packages.paket_counts && data.packages.paket_counts.length > 0 && ( // Изменение: обращение к массиву внутри объекта
                                    data.packages.paket_counts.map((item) => ( // Изменение: используем paket_counts
                                        <tr key={item.id}>
                                            <td scope="row">{item.name}</td>
                                            <td>{item.total}</td>
                                            <td>{item.current_month}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.tableIn}>
                        <h3>Товарооборот</h3>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th scope="col">Товарооборот</th>
                                    <th scope="col">За все время</th>
                                    <th scope="col">За текущий месяц</th>
                                </tr>
                            </thead>
                            <tbody className={styles.homeTbody}>
                                {data.turnovers.length > 0 && data.turnovers.map((item) => (
                                    <tr key={item.branch_id}>
                                        <td scope="row">{item.branch_name}</td>
                                        <td>{item.total_amount}</td>
                                        <td>{item.current_month_amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={styles.tableWrapper} style={{ width: '60%' }}>
                    <div className={styles.tableIn}>
                        <h3>Статусы</h3>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th scope="col">Статусы</th>
                                    <th scope="col">За все время</th>
                                    <th scope="col">За текущий месяц</th>
                                </tr>
                            </thead>
                            <tbody className={styles.homeTbody}>
                                {data.statuses.status_counts && data.statuses.status_counts.length > 0 && (
                                    data.statuses.status_counts.map((item) => (
                                        <tr key={item.id}>
                                            <td scope="row">{item.name}</td>
                                            <td>{item.total}</td>
                                            <td>{item.current_month}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className={styles.singleTableWrapper}>
                <div className={styles.tableIn}>
                    <h3>Бинар</h3>
                    <table className={styles.table} style={{ marginBottom: '50px' }}>
                        <thead>
                            <tr>
                                <th scope="col">Бинар</th>
                                <th scope="col">За все время</th>
                                <th scope="col">За текущий месяц</th>
                            </tr>
                        </thead>
                        <tbody className={styles.homeTbody}>
                            {data.binar.length > 0 && data.binar.map((item) => (
                                <tr key={item.branch_id}>
                                    <td scope="row">{item.branch_name}</td>
                                    <td>{item.total_amount}</td>
                                    <td>{item.current_month_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3>Реферальные бонусы</h3>
                    <table className={styles.table} style={{ marginBottom: '50px' }}>
                        <thead>
                            <tr>
                                <th scope="col">Реферальные бонусы</th>
                                <th scope="col">За все время</th>
                                <th scope="col">За текущий месяц</th>
                            </tr>
                        </thead>
                        <tbody className={styles.homeTbody}>
                            {data.ref.length > 0 && data.ref.map((item) => (
                                <tr key={item.branch_id}>
                                    <td scope="row">{item.branch_name}</td>
                                    <td>{item.total_amount}</td>
                                    <td>{item.current_month_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3>Чек от чека</h3>
                    <table className={styles.table} style={{ marginBottom: '50px' }}>
                        <thead>
                            <tr>
                                <th scope="col">Чек от чека</th>
                                <th scope="col">За все время</th>
                                <th scope="col">За текущий месяц</th>
                            </tr>
                        </thead>
                        <tbody className={styles.homeTbody}>
                            <tr>
                                <td scope="row"> Бишкек</td>
                                <td>0</td>
                                <td>0</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3>Статусные бонусы</h3>
                    <table className={styles.table} style={{ marginBottom: '50px' }}>
                        <thead>
                            <tr>
                                <th scope="col">Статусные бонусы</th>
                                <th scope="col">За все время</th>
                                <th scope="col">За текущий месяц</th>
                            </tr>
                        </thead>
                        <tbody className={styles.homeTbody}>
                            {data.statusTotal.length > 0 && data.statusTotal.map((item) => (
                                <tr key={item.branch_id}>
                                    <td scope="row">{item.branch_name}</td>
                                    <td>{item.total_amount}</td>
                                    <td>{item.current_month_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3>Спонсоркие бонусы</h3>
                    <table className={styles.table} style={{ marginBottom: '50px' }}>
                        <thead>
                            <tr>
                                <th scope="col">Спонсоркие бонусы</th>
                                <th scope="col">За все время</th>
                                <th scope="col">За текущий месяц</th>
                            </tr>
                        </thead>
                        <tbody className={styles.homeTbody}>
                            {data.sponsor.length > 0 && data.sponsor.map((item) => (
                                <tr key={item.branch_id}>
                                    <td scope="row">{item.branch_name}</td>
                                    <td>{item.total_amount}</td>
                                    <td>{item.current_month_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3>Итого</h3>
                    <table className={styles.table} style={{ marginBottom: '50px' }}>
                        <thead>
                            <tr>
                                <th scope="col">За все время</th>
                                <th scope="col">За текущий месяц</th>
                            </tr>
                        </thead>
                        <tbody className={styles.homeTbody}>
                            {data.total.length > 0 && data.total.map((item) => (
                                <tr key={item.branch_id}>
                                    <td scope="row">{item.total_amount}</td>
                                    <td>{item.current_month_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Home;

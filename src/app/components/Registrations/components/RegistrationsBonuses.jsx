'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { API } from '@/constants/constants';
import styles from '../../Participants/Participants.module.css';

export default function RegistrationsBonuses({ participantId, setActiveComponent }) {
    const [bonuses, setBonuses] = useState(null);
    const [bonusHistory, setBonusHistory] = useState([]);

    const getBonuses = async () => {
        const token = localStorage.getItem('authToken');
        const cachedBonuses = localStorage.getItem(`participantInvite_${participantId}`);
        if (cachedBonuses) {
            setBonuses(JSON.parse(cachedBonuses));
        } else {
            const response = await axios.get(`${API}/api/v1/${participantId}/bonuses_summary`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setBonuses(response.data);
            localStorage.setItem(`participantInvite_${participantId}`, JSON.stringify(response.data));
        }
    };

    const getBonusHistory = async () => {
        const token = localStorage.getItem('authToken');
        const cachedHistory = localStorage.getItem(`bonusHistory_${participantId}`);
        if (cachedHistory) {
            setBonusHistory(JSON.parse(cachedHistory));
            setIsHistoryOpen(true);
        } else {
            const response = await axios.get(`${API}/api/v1/participants/bonuses/history/${participantId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setBonusHistory(response.data.bonuses);
            localStorage.setItem(`bonusHistory_${participantId}`, JSON.stringify(response.data.bonuses));
            setIsHistoryOpen(true);
        }
    };

    const handleBack = (name, id) => {
        setActiveComponent({ name, id });
    };

    useEffect(() => {
        getBonuses();
    }, []);

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return (
        <div className={styles.participantsContainer}>
            <div className={styles.tableSection}>
                <div className={styles.tableIn}>
                    {isHistoryOpen && (
                        <div className={styles.detailModal} onClick={() => setIsHistoryOpen(false)}>
                            <div className={styles.detailModalContent} onClick={(e) => e.stopPropagation()}>
                                <div className={styles.detailModalHeader}>
                                    <h2>История бонусов</h2>
                                </div>
                                <div className={styles.detailModalBody}>
                                    <table className={styles.tableBonuses}>
                                        <thead>
                                            <tr>
                                                <th>Дата</th>
                                                <th>Тип бонуса</th>
                                                <th>Сумма</th>
                                            </tr>
                                        </thead>
                                        <tbody className={styles.tableBody} style={{ height: '300px', overflowY: 'auto', display: 'block' }}>
                                            {Array.isArray(bonusHistory) ? (
                                                bonusHistory.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Не указано'}</td>
                                                        <td>{item.bonus_type}</td>
                                                        <td>{item.bonus_amount}</td>
                                                    </tr>
                                                ))
                                            ) : null}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={styles.detailModalFooter}>
                                    <button className={styles.closeDetailBtn} onClick={() => setIsHistoryOpen(false)}>
                                        Закрыть
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={styles.tableWrapper}>
                        <footer className={styles.formButtons} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div>
                                <h2>Бонусы</h2>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={getBonusHistory}>
                                    История бонусов
                                </button>
                                <button type="button" onClick={() => handleBack('Регистрации')}>
                                    Назад
                                </button>
                            </div>
                        </footer>

                        {bonuses && (
                            <>
                                <h3 style={{ marginTop: '20px', backgroundColor: '#dee2e6', padding: '5px' }}>Вознаграждение Реферал</h3>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>За все время</th>
                                            <th>За предыдущий месяц</th>
                                            <th>За текущий месяц</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{bonuses.total.referral}</td>
                                            <td>{bonuses.previous_month.referral}</td>
                                            <td>{bonuses.current_month.referral}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h3 style={{ marginTop: '20px', backgroundColor: '#dee2e6', padding: '5px' }}>Бинар</h3>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>За все время</th>
                                            <th>За предыдущий месяц</th>
                                            <th>За текущий месяц</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{bonuses.total.binary}</td>
                                            <td>{bonuses.previous_month.binary}</td>
                                            <td>{bonuses.current_month.binary}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h3 style={{ marginTop: '20px', backgroundColor: '#dee2e6', padding: '5px' }}>Чек от чека</h3>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>За все время</th>
                                            <th>За предыдущий месяц</th>
                                            <th>За текущий месяц</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{bonuses.total.cheque}</td>
                                            <td>{bonuses.previous_month.cheque}</td>
                                            <td>{bonuses.current_month.cheque}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h3 style={{ marginTop: '20px', backgroundColor: '#dee2e6', padding: '5px' }}>Статусные бонусы</h3>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>За все время</th>
                                            <th>За предыдущий месяц</th>
                                            <th>За текущий месяц</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{bonuses.total.status}</td>
                                            <td>{bonuses.previous_month.status}</td>
                                            <td>{bonuses.current_month.status}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h3 style={{ marginTop: '20px', backgroundColor: '#dee2e6', padding: '5px' }}>Спонсорский бонус</h3>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>За все время</th>
                                            <th>За предыдущий месяц</th>
                                            <th>За текущий месяц</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{bonuses.total.sponsor}</td>
                                            <td>{bonuses.previous_month.sponsor}</td>
                                            <td>{bonuses.current_month.sponsor}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h3 style={{ marginTop: '20px', backgroundColor: '#dee2e6', padding: '5px' }}>Итого бонусов</h3>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>За все время</th>
                                            <th>За предыдущий месяц</th>
                                            <th>За текущий месяц</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{bonuses.total.all_bonuses}</td>
                                            <td>{bonuses.previous_month.all_bonuses}</td>
                                            <td>{bonuses.current_month.all_bonuses}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

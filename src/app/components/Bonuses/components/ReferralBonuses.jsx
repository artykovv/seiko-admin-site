import React, { useEffect, useState } from 'react';
import styles from '../Bonuses.module.css';
import axios from 'axios';
import { API_URL } from '@/api/api';

export default function ReferralBonuses() {
    const [binaty, setBinary] = useState([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDetailOpenHistory, setIsDetailOpenHistory] = useState(false);
    const [participantDetail, setParticipantDetail] = useState(null);
    const [participantHistory, setParticipantHistory] = useState(null);

    // Функции работы с куки
    const setCookie = (name, value, days) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
    };

    const getCookie = (name) => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [key, val] = cookie.split('=').map((item) => item.trim());
            if (key === name) {
                return decodeURIComponent(val);
            }
        }
        return null;
    };

    const getRef = async () => {
        const cachedBinary = getCookie('referralData');
        if (cachedBinary) {
            setBinary(JSON.parse(cachedBinary));
            return;
        }

        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API_URL}/api/v1/participants/ref_bonus/?page=1&page_size=20`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBinary(response.data.participants);
            setCookie('referralData', JSON.stringify(response.data.participants), 7); // Кэшируем на 7 дней
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Неизвестно";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const handleOpenDetail = async (personalNumber) => {
        const cachedDetail = getCookie(`participantInvite_${personalNumber}`);
        if (cachedDetail) {
            setParticipantDetail(JSON.parse(cachedDetail));
            setIsDetailOpen(true);
            return;
        }

        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API_URL}/api/v1/participants/${personalNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCookie(`participantInvite_${personalNumber}`, JSON.stringify(response.data), 7); // Кэшируем детали
            setParticipantDetail(response.data);
            setIsDetailOpen(true);
        } catch (error) {
            console.error("Ошибка загрузки деталей участника:", error);
        }
    };

    const handleOpenHistory = async (personalNumber) => {
        const cachedHistory = getCookie(`refHistory_${personalNumber}`);
        if (cachedHistory) {
            setParticipantHistory(JSON.parse(cachedHistory));
            setIsDetailOpenHistory(true);
            return;
        }

        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API_URL}/api/v1/participants/bonuses/history/${personalNumber}/ref_bonus`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCookie(`refHistory_${personalNumber}`, JSON.stringify(response.data.bonuses), 7); // Кэшируем историю
            setParticipantHistory(response.data.bonuses);
            setIsDetailOpenHistory(true);
        } catch (error) {
            console.error("Ошибка загрузки истории бонусов:", error);
        }
    };

    useEffect(() => {
        getRef();
    }, []);

    return (
        <div>
            {isDetailOpen && <div className={styles.detailModal} onClick={() => setIsDetailOpen(false)}>
                <div className={styles.detailModalContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.detailModalHeader}>
                        <h2>Детали участника</h2>
                    </div>
                    <div className={styles.detailModalBody}>
                        <p> <strong>Персональный номер</strong>: {participantDetail.personal_number}</p>
                        <p> {participantDetail.name} {participantDetail.lastname} {participantDetail.patronymic}</p>
                        <p> <strong>Пакет</strong>: {participantDetail.paket.name} (${participantDetail.paket.price})</p>
                        <p> <strong>Спонсор</strong>: {participantDetail.sponsor ? participantDetail.sponsor.name : 'Не указано'} {participantDetail.sponsor ? participantDetail.sponsor.lastname : 'не указано'}</p>
                        <p> <strong>Наставник</strong>: {participantDetail.mentor ? participantDetail.mentor.name : 'Не указано'} {participantDetail.mentor ? participantDetail.mentor.lastname : 'не указано'}</p>
                        <p> <strong>Логин</strong>: {participantDetail.email}</p>
                        <p> <strong>Личная информация</strong>: {participantDetail.personal_info}</p>
                        <p> <strong>Дата рождения</strong>: {participantDetail.birth_date ? new Date(participantDetail.birth_date).toLocaleDateString() : 'Не указано'}</p>
                        <p> <strong>Телефон</strong>: {participantDetail.phone_number}</p>
                        <p> <strong>Филиал</strong>: {participantDetail.branch.name}</p>
                        <p> <strong>Банк. Номер (Мбанк)</strong>: {participantDetail.bank}</p>
                        <p> <strong>Левый ТО</strong>: {participantDetail.left_volume}</p>
                        <p> <strong>Парвый ТО</strong>: {participantDetail.right_volume}</p>
                    </div>
                    <div className={styles.detailModalFooter}>
                        <button className={styles.closeDetailBtn} onClick={() => setIsDetailOpen(false)}>Закрыть</button>
                    </div>
                </div>
            </div>}
            {isDetailOpenHistory && <div className={styles.detailModal} onClick={() => setIsDetailOpenHistory(false)}>
                <div className={styles.detailModalContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.detailModalHeader}>
                        <h2>Детали участника</h2>
                    </div>
                    <div className={styles.detailModalBodyBinar}>
                        {participantHistory.map((item, index) => (
                            <div key={index} style={{ border: 'solid 1px black', padding: '10px', borderRadius: '8px' }}>
                                <p> <strong>Тип бонуса</strong>: {item.bonus_type}</p>
                                <p> <strong>Сумма</strong>: {item.bonus_amount}</p>
                                <p> <strong>Дата</strong>: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Не указано'}</p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.detailModalFooter}>
                        <button className={styles.closeDetailBtn} onClick={() => setIsDetailOpenHistory(false)}>Закрыть</button>
                    </div>
                </div>
            </div>}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th scope="col">Филиал</th>
                        <th scope="col">Номер</th>
                        <th scope="col">ФИО</th>
                        <th scope="col">ID документа</th>
                        <th scope="col">Дата</th>
                        <th scope="col">Реф бонусы</th>
                        <th scope="col">ИП</th>
                        <th scope="col">Соц фонд</th>
                    </tr>
                </thead>
                <tbody>
                    {binaty.map((item, index) => (
                        <tr key={index}>
                            <td scope="row">{item.branch?.name || "Неизвестно"}</td>
                            <td className={styles.openDetailBtn} onClick={() => handleOpenDetail(item.id)}>{item.personal_number || "Неизвестно"}</td>
                            <td>
                                {item.name || "Неизвестно"} {item.lastname || "Неизвестно"} {item.patronymic || "Неизвестно"}
                            </td>
                            <td>{item.passport_id || "Неизвестно"}</td>
                            <td>{formatDate(item.register_at)}</td>
                            <td>{item.bonus_referral || "Неизвестно"}</td>
                            <td>{item.ip_inn ? "да" : "нет"}</td>
                            <td>{item.pensioner ? "да" : "нет"}</td>
                            <td className={styles.openDetailBtn} onClick={() => handleOpenHistory(item.id)}>История</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

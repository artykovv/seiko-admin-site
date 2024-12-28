import React, { useEffect, useState } from 'react';
import styles from '../Gifts.module.css';
import axios from 'axios';
import { API_URL } from '@/api/api';

export default function AutoProgram() {
    const [binaty, setBinary] = useState([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [participantDetail, setParticipantDetail] = useState(null);

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

    const getBinary = async () => {
        const cachedBinary = getCookie('AutoProgram');
        if (cachedBinary) {
            setBinary(JSON.parse(cachedBinary));
            return;
        }

        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API_URL}/api/v1/auto/bonuses?page=1&page_size=20`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);

            setBinary(response.data.participants);
            setCookie('AutoProgram', JSON.stringify(response.data.participants), 7); // Кэшируем на 7 дней
        } catch (error) {
            console.error(error);
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
            setParticipantDetail(response.data);
            setCookie(`participantInvite_${personalNumber}`, JSON.stringify(response.data), 7); // Кэшируем на 7 дней
            setIsDetailOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getBinary();
    }, []);
    return (
        <div>
            {isDetailOpen && <div className={styles.detailModal} onClick={() => setIsDetailOpen(false)}>
                <div className={styles.detailModalContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.detailModalHeader}>
                        <h2>Детали участника</h2>
                    </div>
                    <div className={styles.detailModalBody}>
                        <p><strong>Персональный номер:</strong> {participantDetail?.personal_number}</p>
                        <p>{participantDetail?.name} {participantDetail?.lastname} {participantDetail?.patronymic}</p>
                        <p><strong>Пакет:</strong> {participantDetail?.paket?.name} (${participantDetail?.paket?.price})</p>
                        <p><strong>Спонсор:</strong> {participantDetail?.sponsor?.name || 'Не указано'} {participantDetail?.sponsor?.lastname || ''}</p>
                        <p><strong>Наставник:</strong> {participantDetail?.mentor?.name || 'Не указано'} {participantDetail?.mentor?.lastname || ''}</p>
                        <p><strong>Логин:</strong> {participantDetail?.email}</p>
                        <p><strong>Личная информация:</strong> {participantDetail?.personal_info}</p>
                        <p><strong>Дата рождения:</strong> {participantDetail?.birth_date ? formatDate(participantDetail.birth_date) : 'Не указано'}</p>
                        <p><strong>Телефон:</strong> {participantDetail?.phone_number}</p>
                        <p><strong>Филиал:</strong> {participantDetail?.branch?.name}</p>
                        <p><strong>Банк. Номер (Мбанк):</strong> {participantDetail?.bank}</p>
                        <p><strong>Левый ТО:</strong> {participantDetail?.left_volume}</p>
                        <p><strong>Правый ТО:</strong> {participantDetail?.right_volume}</p>
                    </div>
                    <div className={styles.detailModalFooter}>
                        <button className={styles.closeDetailBtn} onClick={() => setIsDetailOpen(false)}>Закрыть</button>
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
                        <th scope="col">ИП</th>
                        <th scope="col">Соц фонд</th>
                    </tr>
                </thead>
                <tbody>
                    {binaty.map((item, index) => (
                        <tr key={index}>
                            <td scope="row">{item.branch?.name || "Неизвестно"}</td>
                            <td className={styles.openDetailBtn} onClick={() => handleOpenDetail(item.id)}>{item.personal_number || "Неизвестно"}</td>
                            <td>{item.name || "Неизвестно"} {item.lastname || "Неизвестно"} {item.patronymic || "Неизвестно"}</td>
                            <td>{item.passport_id || "Неизвестно"}</td>
                            <td>{formatDate(item.register_at)}</td>
                            <td>{item.ip_inn ? "да" : "нет"}</td>
                            <td>{item.pensioner ? "да" : "нет"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { API } from '@/constants/constants';

import styles from '../Participants.module.css';

export default function ParticipantInvite({ participantId, setActiveComponent }) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [participantDetail, setParticipantDetail] = useState(null);
    const [sponsored, setSponsored] = useState([]);

    const getSponsored = async () => {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API}/api/v1/participant/${participantId}/sponsored`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setSponsored(response.data);
    };

    const handleBack = (name, id) => {
        setActiveComponent({ name, id });
    };

    const handleOpenDetail = async (personalNumber) => {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API}/api/v1/participants/${personalNumber}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setParticipantDetail(response.data);
        setIsDetailOpen(true);
    };

    useEffect(() => {
        getSponsored();
    }, []);

    return (
        <div className={styles.participantsContainer}>
            <div className={styles.tableSection}>
                <div className={styles.tableIn}>
                    {isDetailOpen && <div className={styles.detailModal} onClick={() => setIsDetailOpen(false)}>
                        <div className={styles.detailModalContent} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.detailModalHeader}>
                                <h2>Детали участника</h2>
                            </div>
                            <div className={styles.detailModalBody}>
                                <p> <strong>Персональный номер:</strong> {participantDetail.personal_number}</p>
                                <p> {participantDetail.name} {participantDetail.lastname} {participantDetail.patronymic}</p>
                                <p> <strong>Пакет:</strong> {participantDetail.paket.name} (${participantDetail.paket.price})</p>
                                <p> <strong>Спонсор:</strong> {participantDetail.sponsor ? participantDetail.sponsor.name : 'Не указано'}</p>
                                <p> <strong>Наставник:</strong> {participantDetail.mentor ? participantDetail.mentor.name : 'Не указано'}</p>
                                <p> <strong>Логин:</strong> {participantDetail.login}</p>
                                <p> <strong>Личная информация:</strong></p>
                                <p> <strong>Дата рождения:</strong> {participantDetail.birth_date ? new Date(participantDetail.birth_date).toLocaleDateString() : 'Не указано'}</p>
                                <p> <strong>Телефон:</strong> {participantDetail.phone_number}</p>
                                <p> <strong>Филиал:</strong> {participantDetail.branch.name}</p>
                                <p> <strong>Банк. Номер (Мбанк):</strong> {participantDetail.bank}</p>
                            </div>
                            <div className={styles.detailModalFooter}>
                                <button className={styles.closeDetailBtn} onClick={() => setIsDetailOpen(false)}>Закрыть</button>
                            </div>
                        </div>
                    </div>}
                    <div className={styles.tableWrapper}>
                        <footer className={styles.formButtons}>
                            <button type="button" onClick={() => handleBack('Участники')}>
                                Назад
                            </button>
                        </footer>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th scope="col">Филиал</th>
                                    <th scope="col">Персональный N</th>
                                    <th scope="col">ФИО</th>
                                    <th scope="col">Статус</th>
                                    <th scope="col">В бинаре с</th>
                                    <th scope="col">ТО малой ветки</th>
                                    <th scope="col">ТО большой ветки</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sponsored && sponsored.length > 0 ? (
                                    sponsored.map((item, index) => (
                                        <tr key={index}>
                                            <td scope="row">{item.branch.name}</td>
                                            <td>
                                                <button className={styles.openDetailBtn} onClick={() => handleOpenDetail(item.id)}>{item.personal_number}</button>
                                            </td>
                                            <td>{item.name} {item.lastname} {item.patronymic}</td>
                                            <td>{item.paket.name}</td>
                                            <td>{item.register_at ? new Date(item.register_at).toLocaleDateString() : 'Не указано'}</td>
                                            <td>{item.volumes.big_volume}</td>
                                            <td>{item.volumes.small_volume}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center' }}>Нет данных</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

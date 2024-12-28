import React, { useEffect, useState } from 'react';
import styles from '../Gifts.module.css';
import axios from 'axios';
import { API_URL } from '@/api/api';
import Image from 'next/image';
import deletePng from "@/assets/delete.svg";
import add from '@/assets/add.webp';

export default function SurpriseBonus({ setActiveComponentGift }) {
    const [binaty, setBinary] = useState([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [participantDetail, setParticipantDetail] = useState(null);
    const [pageCount, setPageCount] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const setLocalStorage = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    const getLocalStorage = (key) => {
        const item = localStorage.getItem(key);
        if (!item) return null;
        return JSON.parse(item);
    };

    const getBinary = async () => {
        const cachedBinary = getLocalStorage('SurpriseBonus');
        if (cachedBinary) {
            setBinary(cachedBinary);
            return;
        }

        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API_URL}/api/v1/surprise/bonuses?page=${currentPage}&page_size=${pageCount}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data && response.data.participants) {
                setTotalPages(response.data.total_pages);
                setBinary(response.data.participants);
                setLocalStorage('SurpriseBonus', response.data.participants);
            } else {
                console.error('Ошибка: отсутствуют участники в ответе API');
            }
        } catch (error) {
            console.error('Ошибка при получении бонусов:', error);
        }
    };


    const handleOpenDetail = async (personalNumber) => {
        const cachedDetail = getLocalStorage(`participantInvite_${personalNumber}`, 7 * 24 * 60 * 60 * 1000); // Кэш на 7 дней
        if (cachedDetail) {
            setParticipantDetail(cachedDetail);
            setIsDetailOpen(true);
            return;
        }

        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API_URL}/api/v1/participants/${personalNumber}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setParticipantDetail(response.data);
            setLocalStorage(`participantInvite_${personalNumber}`, response.data);
            setIsDetailOpen(true);
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

    const handleDelete = async (id) => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.delete(`${API_URL}/api/v1/surprise/bonus/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const cachedBinary = getLocalStorage('SurpriseBonus', 7 * 24 * 60 * 60 * 1000);
            if (cachedBinary) {
                const updatedBinary = cachedBinary.filter(item => item.id !== id);
                setBinary(updatedBinary);
                setLocalStorage('SurpriseBonus', updatedBinary);
            }
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    };

    const handlePageCountChange = (count) => {
        setPageCount(count);
        setCurrentPage(1); // Возвращаем на первую страницу при изменении количества элементов на странице
        getBinary();
    };


    const handlePageChange = (page) => {
        setCurrentPage(page);
        setLocalStorage('SurpriseBonus', []); // Сбросить кэш для нового запроса
        getBinary();
    };

    useEffect(() => {
        getBinary();
    }, [currentPage, pageCount]);


    return (
        <div>
            <div className={styles.btnsWrapperAdd}>
                <button className={styles.addBtn} onClick={() => setActiveComponentGift('SurpriseBonusAdd')}>
                    <Image src={add} alt="add" />
                    Добавить
                </button>
            </div>
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
                        <th scope="col">Статус</th>
                        <th scope="col" style={{ textAlign: 'center' }}>Действия</th>
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
                            <td>{item.status ? item.status.name : 'Не указано'}</td>
                            <td style={{ display: 'flex', justifyContent: 'center' }}>
                                <button className={styles.btn}>
                                    <Image src={deletePng} alt="delete" onClick={() => handleDelete(item.id)} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)} disabled={currentPage === index + 1}>
                        {index + 1}
                    </button>
                ))}
                <div className={styles.selectPage}>
                    <select onChange={(e) => handlePageCountChange(Number(e.target.value))}>
                        <option value={20} style={pageCount === 20 ? { backgroundColor: '#007BFF' } : {}}>20</option>
                        <option value={50} style={pageCount === 50 ? { backgroundColor: '#007BFF' } : {}}>50</option>
                        <option value={100} style={pageCount === 100 ? { backgroundColor: '#007BFF' } : {}}>100</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

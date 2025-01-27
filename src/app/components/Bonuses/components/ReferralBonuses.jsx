import React, { useEffect, useRef, useState } from 'react';
import styles from '../Bonuses.module.css';
import axios from 'axios';
import { API } from '@/constants/constants';
import toast from 'react-hot-toast';

export default function ReferralBonuses() {
    const [binary, setBinary] = useState([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDetailOpenHistory, setIsDetailOpenHistory] = useState(false);
    const [participantDetail, setParticipantDetail] = useState(null);
    const [participantHistory, setParticipantHistory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageCountRef = useRef(20);

    const getRef = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API}/api/v1/participants/ref_bonus/?page=${currentPage}&page_size=${pageCountRef.current}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data && response.data.participants) {
                setTotalPages(response.data.total_pages);
                setBinary(response.data.participants);
            } else {
            }
        } catch (error) {
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
        const token = localStorage.getItem('authToken');
        toast.loading("Загрузка...", { duration: 1000 })
        try {
            const response = await axios.get(`${API}/api/v1/participants/${personalNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setParticipantDetail(response.data);
            setIsDetailOpen(true);
        } catch (error) {
        }
    };

    const handleOpenHistory = async (personalNumber) => {
        const token = localStorage.getItem('authToken');
        toast.loading("Загрузка...", { duration: 1000 })
        try {
            const response = await axios.get(`${API}/api/v1/participants/bonuses/history/${personalNumber}/ref_bonus`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setParticipantHistory(response.data.bonuses);
            setIsDetailOpenHistory(true);
        } catch (error) {
        }
    };

    const handlePageCountChange = (event) => {
        pageCountRef.current = Number(event.target.value);
        setCurrentPage(1);
        getRef();
    };


    useEffect(() => {
        getRef();
    }, [currentPage]);

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
                        <p> <strong>Пакет</strong>: {participantDetail.paket?.name} (${participantDetail.paket?.price})</p>
                        <p> <strong>Статус</strong>: {participantDetail.status.name}</p>
                        <p> <strong>Спонсор</strong>: {participantDetail.sponsor ? participantDetail.sponsor.name : 'Не указано'} {participantDetail.sponsor ? participantDetail.sponsor.lastname : 'не указано'}  {participantDetail.sponsor ? participantDetail.sponsor.patronymic : 'не указано'}  {participantDetail.sponsor ? participantDetail.sponsor.personal_number : 'не указано'}</p>
                        <p> <strong>Наставник</strong>: {participantDetail.mentor ? participantDetail.mentor.name : 'Не указано'} {participantDetail.mentor ? participantDetail.mentor.lastname : 'не указано'}  {participantDetail.mentor ? participantDetail.mentor.patronymic : 'не указано'}  {participantDetail.mentor ? participantDetail.mentor.personal_number : 'не указано'}</p>
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
                    {binary && binary.length > 0 ? (
                        binary.map((item, index) => (
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
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" style={{ textAlign: 'center' }}>Нет данных</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className={styles.pagination}>
                <div className={styles.paginate}>
                    {(() => {
                        const pages = [];
                        const isStart = currentPage <= 4;
                        const isEnd = currentPage >= totalPages - 3;

                        // Добавляем первую страницу
                        if (totalPages >= 1) {
                            pages.push(
                                <button
                                    key="pagination_page_1"
                                    onClick={() => setCurrentPage(1)}
                                    className={currentPage === 1 ? styles.activePage : ''}
                                >
                                    1
                                </button>
                            );
                        }

                        // Добавляем многоточие перед диапазоном страниц
                        if (!isStart && totalPages > 6) {
                            pages.push(<span key="start_ellipsis">...</span>);
                        }

                        // Рассчитываем диапазон страниц (средние кнопки)
                        const startPage = Math.max(2, currentPage - 2); // Страницы начиная с 2
                        const endPage = Math.min(totalPages - 1, currentPage + 2); // Заканчивается на предпоследней странице

                        for (let page = startPage; page <= endPage; page++) {
                            // Исключаем возможные дубликаты с первой или последней страницей
                            if (page > 1 && page < totalPages) {
                                pages.push(
                                    <button
                                        key={`pagination_page_${page}`}
                                        onClick={() => setCurrentPage(page)}
                                        className={currentPage === page ? styles.activePage : ''}
                                    >
                                        {page}
                                    </button>
                                );
                            }
                        }

                        // Добавляем многоточие после диапазона страниц
                        if (!isEnd && totalPages > 3) {
                            pages.push(<span key="end_ellipsis">...</span>);
                        }

                        // Добавляем последнюю страницу
                        if (totalPages > 1) {
                            pages.push(
                                <button
                                    key={`pagination_page_${totalPages}`}
                                    onClick={() => setCurrentPage(totalPages)}
                                    className={currentPage === totalPages ? styles.activePage : ''}
                                >
                                    {totalPages}
                                </button>
                            );
                        }

                        return pages;
                    })()}
                </div>
                <div className={styles.selectPage}>
                    <select defaultValue={pageCountRef.current} onChange={handlePageCountChange}>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

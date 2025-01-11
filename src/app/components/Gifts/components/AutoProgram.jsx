import React, { useEffect, useState } from 'react';
import styles from '../Gifts.module.css';
import axios from 'axios';
import { API } from '@/constants/constants';

export default function AutoProgram() {
    const [binary, setBinary] = useState([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [participantDetail, setParticipantDetail] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(20);
    const [totalPages, setTotalPages] = useState(0);

    const getBinary = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API}/api/v1auto/bonuses?page=${currentPage}&page_size=${pageCount}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTotalPages(response.data.total_pages);
            setBinary(response.data.participants);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenDetail = async (personalNumber) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API}/api/v1/participants/${personalNumber}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setParticipantDetail(response.data);
            setIsDetailOpen(true);
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageCountChange = (count) => {
        setPageCount(count);
        setCurrentPage(1); // Возвращаем на первую страницу при изменении количества элементов на странице
    };

    useEffect(() => {
        getBinary();
    }, [currentPage, pageCount]);

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
                    {binary.map((item, index) => (
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
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)} disabled={currentPage === index + 1}>
                        {index + 1}
                    </button>
                ))}
                <div className={styles.selectPage}>
                    <select onChange={(e) => handlePageCountChange(Number(e.target.value))} value={pageCount}>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

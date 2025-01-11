import React, { useEffect, useState } from 'react';
import styles from '../Gifts.module.css';
import axios from 'axios';
import { API } from '@/constants/constants';

export default function TouristBonus() {
    const [binary, setBinary] = useState([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [participantDetail, setParticipantDetail] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(20);
    const [totalPages, setTotalPages] = useState(0);


    const getBinary = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API}/api/v1/tour/bonuses?page=${currentPage}&page_size=${pageCount}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBinary(response.data.participants);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenDetail = async (personalNumber) => {
        const cachedDetail = getLocalStorage(`participantInvite_${personalNumber}`);
        if (cachedDetail) {
            setParticipantDetail(cachedDetail);
            setIsDetailOpen(true);
            return;
        }

        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API}/api/v1/participants/${personalNumber}`, {
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageCountChange = (count) => {
        setPageCount(count);
        setCurrentPage(1);
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
                        {/* ... */}
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
                        <th scope="col">Дата создания бонус</th>
                        <th scope="col">Дата активации бонуса</th>
                        <th scope="col">Активировано</th>
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
                            <td>{formatDate(item.active_time)}</td>
                            <td className={styles.toggleSwitch}>
                                <input
                                    className={styles.toggleInput}
                                    id={`toggle-${item.id}`}
                                    type="checkbox"
                                    checked={item.active}
                                    onChange={() => handleSwitch(item.id, item.active)}
                                />
                                <label className={styles.toggleLabel} htmlFor={`toggle-${item.id}`}></label>
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
                    <select onChange={(e) => handlePageCountChange(Number(e.target.value))} value={pageCount}>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

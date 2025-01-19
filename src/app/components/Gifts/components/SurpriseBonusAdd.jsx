import React, { useCallback } from 'react'
import styles from '../Gifts.module.css'
import { useEffect, useState, useRef } from 'react';
import arrowFilter from '@/assets/arrowdown.webp';

import Image from 'next/image';
import axios from 'axios';
import { API } from '@/constants/constants';

import toast from 'react-hot-toast';

export default function SurpriseBonusAdd({ setActiveComponent }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Фильтр');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const searchInputRef = useRef('');
    const [participants, setParticipants] = useState([]);
    const pageCountRef = useRef(20);

    const handleSelectChange = (option) => {
        setSelectedOption(option);
        setIsFilterOpen(false);
        setCurrentPage(1);
        getParticipants(option);
    };

    const handlePageCountChange = (event) => {
        pageCountRef.current = Number(event.target.value);
        setCurrentPage(1);
        getParticipants(selectedOption);
    };

    const handleSearchChange = (event) => {
        searchInputRef.current = event.target.value;
        if (searchInputRef.current === '') {
            getParticipants(selectedOption);
        } else if (searchInputRef.current.length > 0) {
            setCurrentPage(1);
            getParticipants(searchInputRef);
        }
    };


    const getParticipants = useCallback(async (option) => {
        const token = localStorage.getItem('authToken');
        try {
            const url = option === 'Все' || option === 'Фильтр'
                ? `${API}/api/v1/participants/for/surprise/bonuses?page=${currentPage}&page_size=${pageCountRef.current}`
                : `${API}/api/v1/participants/for/surprise/bonuses?page=${currentPage}&page_size=${pageCountRef.current}&paket_names=${option}`;

            const searchUrl = `${API}/api/v1/search/participants?query=${searchInputRef.current}&page=${currentPage}&page_size=${pageCountRef.current}`;
            const response = searchInputRef.current
                ? await axios.get(searchUrl, { headers: { Authorization: `Bearer ${token}` } })
                : await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });

            setParticipants(response.data.participants || []);
            setTotalPages(response.data.total_pages);
        } catch (error) {
        }
    }, [currentPage]);

    useEffect(() => {
        getParticipants(selectedOption);
    }, [selectedOption, currentPage]);


    //! Модальное окно
    const [participantDetail, setParticipantDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleOpenDetail = async (personalNumber) => {
        const token = localStorage.getItem('authToken');
        toast.loading("Загрузка...", { duration: 1000 })
        const response = await axios.get(`${API}/api/v1/participants/${personalNumber}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        setParticipantDetail(response.data);
        setIsDetailOpen(true);
    };
    //! Модальное окно

    const handleAddSurprice = async (id) => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.post(
                `${API}/api/v1/add/surprise/bonus/${id}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            toast.success('Бонус успешно добавлен!');
            getParticipants(selectedOption);
        } catch (error) {
            console.log(error);
            toast.error('Ошибка при добавлении бонуса');
        }
    }

    const handleBack = (name) => {
        setActiveComponent({ name })
    };

    return (
        <div className={styles.giftsContainer}>
            <div className={styles.tableSection}>
                <div className={styles.tableIn}>
                    <div className={styles.participantsContainer}>
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
                        <div className={styles.tableWrapper}>
                            <div className={styles.search}>
                                <input
                                    className={styles.searchInput}
                                    type="text"
                                    placeholder="Поиск"
                                    defaultValue={searchInputRef.current}
                                    onChange={handleSearchChange}
                                />
                                <button className={styles.filterBtn} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                                    {selectedOption}
                                    <Image src={arrowFilter} alt="arrow-filter" style={{ transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                                </button>
                                <div className={styles.filterMenu} style={{ display: isFilterOpen ? 'flex' : 'none' }}>
                                    <button className={styles.selectFilter} onClick={() => handleSelectChange('Все')}>Все</button>
                                    <button className={styles.selectFilter} onClick={() => handleSelectChange('START')}>START</button>
                                    <button className={styles.selectFilter} onClick={() => handleSelectChange('PARTNER')}>PARTNER</button>
                                    <button className={styles.selectFilter} onClick={() => handleSelectChange('BUSINESS')}>BUSINESS</button>
                                    <button className={styles.selectFilter} onClick={() => handleSelectChange('ELITE')}>ELITE</button>
                                    <button className={styles.selectFilter} onClick={() => handleSelectChange('PREMIUM')}>PREMIUM</button>
                                </div>
                            </div>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th scope="col">Филиал</th>
                                        <th scope="col">Персональный N</th>
                                        <th scope="col">ФИО</th>
                                        <th scope="col">Пакет</th>
                                        <th scope="col">В организации</th>
                                        <th scope="col">Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participants && participants.length > 0 ? (
                                        participants.map((item, index) => (
                                            <tr key={index}>
                                                <td scope="row">{item.branch.name}</td>
                                                <td>
                                                    <button className={styles.openDetailBtn} onClick={() => handleOpenDetail(item.id)}>{item.personal_number}</button>
                                                </td>
                                                <td>{item.name} {item.lastname} {item.patronymic}</td>
                                                <td>{item.paket.name}</td>
                                                <td>{item.register_at ? new Date(item.register_at).toLocaleDateString() : 'Не указано'}</td>
                                                <td className={styles.actions} >
                                                    <button onClick={() => handleAddSurprice(item.id)} className={styles.btn} style={{ color: "#fff", paddingInline: "10px", backgroundColor: "#007BFF" }}>
                                                        Добавить
                                                    </button>
                                                </td>
                                            </tr>
                                        ))) : (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center' }}>Нет данных</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
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
                    <footer className={styles.formButtons}>
                        <button type="button" onClick={() => handleBack('Подарочные')}>
                            Назад
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    )
}

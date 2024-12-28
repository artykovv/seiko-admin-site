import React from 'react'
import styles from '../Gifts.module.css'
import { useEffect, useState, useRef } from 'react';
import arrowFilter from '@/assets/arrowdown.webp';

import Image from 'next/image';
import axios from 'axios';
import { API_URL } from '@/api/api';

import toast, { Toaster } from 'react-hot-toast';

export default function SurpriseBonusAdd({ setActiveComponentGift }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Фильтр');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const searchInputRef = useRef('');
    const [participants, setParticipants] = useState([]);
    const [pageCount, setPageCount] = useState(20);

    // Загрузка участников из localStorage при монтировании компонента
    useEffect(() => {
        const cachedParticipants = localStorage.getItem('participants');
        if (cachedParticipants) {
            setParticipants(JSON.parse(cachedParticipants));
        } else {
            setParticipants([]);
        }
    }, []);

    const handleSelectChange = (option) => {
        setSelectedOption(option);
        setIsFilterOpen(false);
        setCurrentPage(1);
        getParticipants(option);
    };

    const handleParticipantPage = (name, id) => {
        setActiveComponent({ name, id });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        getParticipants();
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

    const getParticipants = async (option) => {
        const token = localStorage.getItem('authToken'); // Чтение токена из localStorage
        const url = option === 'Все' || option === 'Фильтр'
            ? `${API_URL}/api/v1/participants/for/surprise/bonuses?page=${currentPage}&page_size=${pageCount}`
            : `${API_URL}/api/v1/participants/for/surprise/bonuses?page=${currentPage}&page_size=${pageCount}&paket_names=${option}`;

        const searchUrl = `${API_URL}/api/v1/search/participants?query=${searchInputRef.current}&page=${currentPage}&page_size=${pageCount}`;
        if (searchInputRef.current) {
            const response = await axios.get(searchUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setParticipants(response.data.participants || []);
            setTotalPages(response.data.total_pages);
        } else {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setParticipants(response.data.participants || []);
            setTotalPages(response.data.total_pages);
            localStorage.setItem('participants', JSON.stringify(response.data));
        }
    };

    useEffect(() => {
        getParticipants(selectedOption);
    }, [selectedOption]);

    //! Модальное окно
    const [participantDetail, setParticipantDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleOpenDetail = async (personalNumber) => {
        const token = localStorage.getItem('authToken'); // Чтение токена из localStorage
        const cachedDetail = localStorage.getItem(`participant_${personalNumber}`); // Загружаем данные из localStorage

        let toastId;
        if (!cachedDetail) {
            toastId = toast.loading('Загрузка...', {
                duration: 1500,
                position: 'bottom-left',
            });
        } else if (toastId) {
            toast.dismiss(toastId);
        }

        if (cachedDetail) {
            setParticipantDetail(JSON.parse(cachedDetail));
            setIsDetailOpen(true);
            return;
        }

        const response = await axios.get(`${API_URL}/api/v1/participants/${personalNumber}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        localStorage.setItem(`participant_${personalNumber}`, JSON.stringify(response.data)); // Сохраняем данные в localStorage
        setParticipantDetail(response.data);
        setIsDetailOpen(true);
    };
    //! Модальное окно

    const handleAddSurprice = async (id) => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.post(
                `${API_URL}/api/v1/add/surprise/bonus/${id}`,
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


    return (
        <div>
            <div className={styles.participantsContainer}>
                <div className={styles.tableSection}>
                    <div className={styles.tableIn}>
                        <Toaster />

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
                                    <p> <strong>Логин:</strong> {participantDetail.email}</p>
                                    <p> <strong>Личная информация:</strong> {participantDetail.personal_info}</p>
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
                                    {participants.length > 0 && participants.map((item) => (
                                        <tr key={item.id}>
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.pagination}>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button key={index} onClick={() => handlePageChange(index + 1)} disabled={currentPage === index + 1}>
                                    {index + 1}
                                </button>
                            ))}
                            <div className={styles.selectPage}>
                                <select>
                                    <option style={pageCount === 20 ? { backgroundColor: '#007BFF' } : {}} onClick={() => setPageCount(20)}>
                                        20
                                    </option>
                                    <option style={pageCount === 50 ? { backgroundColor: '#007BFF' } : {}} onClick={() => setPageCount(50)}>
                                        50
                                    </option>
                                    <option style={pageCount === 100 ? { backgroundColor: '#007BFF' } : {}} onClick={() => setPageCount(100)}>
                                        100
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className={styles.formButtons}>
                {/* <span>{errorMessage}</span> */}
                <button type="button" onClick={() => setActiveComponentGift('SurpriseBonus')}>
                    Назад
                </button>
            </footer>
        </div>
    )
}

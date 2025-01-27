import React, { useState, useCallback, useRef } from 'react'
import styles from '../Rebate.module.css'
import axios from 'axios';
import { API } from '@/constants/constants';
import toast from 'react-hot-toast';

export default function RebateAdd({ setActiveComponent }) {
    const [errorMessage, setErrorMessage] = useState('')
    const [selectedSponsor, setSelectedSponsor] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const [data, setData] = useState({
        participant_id: selectedSponsor,
        amount: '',
        register_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    })

    const handleAmountChange = (event) => {
        setData({ ...data, amount: event.target.value });
    };

    const handleDateChange = (event) => {
        const formattedDate = new Date(event.target.value).toISOString().slice(0, 19).replace('T', ' ');
        setData({ ...data, register_at: formattedDate });
    };

    const handleSearch = async (value) => {
        setSearchValue(value);
        if (value.length >= 1) {
            try {
                const response = await axios.get(`${API}/api/v1/search/participants?query=${value}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setParticipants(response.data.participants);
            } catch (error) {
                console.error('Error fetching participants:', error);
            }
        } else {
            setParticipants([]);
        }
    };

    const handleSponsorSelect = (id, name, lastname, patronymic, personal_number) => {
        setSelectedSponsor(id);
        setData({ ...data, participant_id: id, amount: '' });
        setSearchValue(`${name} ${lastname} ${patronymic} ${personal_number}`);
        setParticipants([]);
    };

    const handleSubmit = async (event) => {
        const token = localStorage.getItem('authToken');
        event.preventDefault();
        const requestData = {
            participant_id: selectedSponsor,
            amount: data.amount,
            register_at: data.register_at,
        };
        try {
            const response = await axios.post(`${API}/api/v1/sales`, requestData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                handleBack('Cкидка');
                toast.success("Данные успешно добавлены");
            }
        } catch (error) {
            setErrorMessage('Данные уже существуют или не все поля заполнены корректно.');
        }
    };

    const handleBack = (name, id) => {
        setActiveComponent({ name, id });
    };

    return (
        <div>
            <div className={styles.participantsContainer}>
                <form
                    className={styles.formSection}
                    onSubmit={handleSubmit}
                >
                    <div className={styles.formBlock}>
                        <div className={styles.formRow}>
                            <label>Участники</label>
                            <input
                                className={styles.searchInput}
                                type="text"
                                placeholder="Поиск спонсора"
                                value={searchValue}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <div className={styles.selectWrapper}>
                            {participants && participants.map((item) => (
                                <div className={styles.select} key={item.id}>
                                    <button
                                        onClick={() => handleSponsorSelect(item.id, item.name, item.lastname, item.patronymic, item.personal_number)}
                                        type="button"
                                        style={{ backgroundColor: selectedSponsor === item.id && 'lightblue' }}
                                    >
                                        {item.name} {item.lastname} {item.patronymic} {item.personal_number} {item.position}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className={styles.formRow}>
                            <label>Сумма</label>
                            <input
                                className={styles.searchInput}
                                type="number"
                                placeholder="Сумма"
                                value={data.amount}
                                onChange={handleAmountChange}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>Дата</label>
                            <input
                                className={styles.searchInput}
                                type="date"
                                value={data.register_at.split(' ')[0]}
                                onChange={handleDateChange}
                            />
                        </div>
                    </div>
                    <footer className={styles.formButtons}>
                        <span>{errorMessage}</span>
                        <button type="button" onClick={() => handleBack('Cкидка', null)}>Назад</button>
                        <button type="submit">
                            Добавить
                        </button>
                    </footer>
                </form>
            </div >
        </div >
    )
}

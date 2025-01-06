import React, { useEffect, useState } from 'react';
import styles from '../Branches.module.css';
import axios from 'axios';
import { API_URL } from '@/api/api';

export default function BranchesAdd({ setActiveComponent }) {
    const [dates, setDates] = useState({
        code: "",
        name: "",
        address: "",
        phone_number: "",
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDates((prevDates) => ({
            ...prevDates,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        const token = localStorage.getItem('authToken');
        event.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/v1/branches`, dates,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            console.log(response);

            setActiveComponent({ name: 'Филиалы', id: null });
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
                <form className={styles.formSection} onSubmit={handleSubmit}>
                    <h3>Добавить филиал</h3>
                    <div className={styles.formRow}>
                        <label>Код</label>
                        <input
                            type="text"
                            name="code"
                            value={dates.code || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Город</label>
                        <input
                            type="text"
                            name="name"
                            value={dates.name || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Адресс</label>
                        <input
                            type="text"
                            name="address"
                            value={dates.address || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Телефон</label>
                        <input
                            type="text"
                            name="phone_number"
                            value={dates.phone_number || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <footer className={styles.formButtons}>
                        <span>{errorMessage}</span>
                        <button type="button" onClick={() => handleBack('Филиалы', null)}>
                            Назад
                        </button>
                        <button type="submit">Добавить</button>
                    </footer>
                </form>
            </div>
        </div>
    );
}

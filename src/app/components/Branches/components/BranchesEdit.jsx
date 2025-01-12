import React, { useEffect, useState } from 'react';
import styles from '../Branches.module.css';
import axios from 'axios';
import { API } from '@/constants/constants';
import toast from 'react-hot-toast';

export default function BranchesEdit({ setActiveComponent, participantId }) {
    const [dates, setDates] = useState({
        code: "",
        name: "",
        address: "",
        phone_number: "",
    });
    const [errorMessage, setErrorMessage] = useState('');

    const getBranchesID = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API}/api/v1/branches/${participantId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setDates(response.data);
        } catch (error) {
        }
    };

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
            await axios.put(`${API}/api/v1/branches/${participantId}`, dates,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            toast.success('Данные успешно обновлены!')
            setActiveComponent({ name: 'Филиалы', id: null });
        } catch (error) {
            setErrorMessage('Данные уже существуют или не все поля заполнены корректно.');
        }
    };

    const handleBack = (name, id) => {
        setActiveComponent({ name, id });
    };

    useEffect(() => {
        getBranchesID();
    }, []);

    return (
        <div>
            <div className={styles.participantsContainer}>
                <form className={styles.formSection} onSubmit={handleSubmit}>
                    <h3>Изменить филиал</h3>
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
                        <button type="submit">Сохранить</button>
                    </footer>
                </form>
            </div>
        </div>
    );
}

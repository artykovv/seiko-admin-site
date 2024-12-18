'use client'
import React, { useState, useEffect } from 'react'
import styles from '../Registrations.module.css'
import axios from 'axios';
import { API_URL } from '@/api/api';

export default function AddStructure({ setActiveComponent, participantId }) {
    const [errorMessage, setErrorMessage] = useState('')
    const [pakets, setPakets] = useState([]);
    const [freePositions, setFreePositions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPositions, setFilteredPositions] = useState([]);
    const [selectedSponsor, setSelectedSponsor] = useState(null); // Добавлен для хранения выбранного спонсора

    const [data, setData] = useState({
        mentor_id: '',
        paket_id: '',
        participant_id: parseInt(participantId),
        position: '',
        sponsor_id: ''
    })


    const filterPositions = (term) => {
        if (!Array.isArray(freePositions)) {
            console.error('freePositions не является массивом:', freePositions);
            return; // Выход из функции, если freePositions не массив
        }
        const lowerCaseTerm = term.toLowerCase(); // Преобразуем вводимое значение в ��ижний регистр
        const filtered = freePositions.filter(position =>
            position.name.toLowerCase().includes(lowerCaseTerm) || // Преобразуем name в нижний регистр
            position.personal_number.toLowerCase().includes(lowerCaseTerm) // Оставляем personal_number без изменений
        );
        setFilteredPositions(filtered);
    };

    const handleChange = (field, value) => {
        if (field === 'search') {
            setSearchTerm(value);
            filterPositions(value);
        } else if (field === 'sponsor_id') {
            setData({ ...data, [field]: value, mentor_id: value });
            setSelectedSponsor(value); // Обновляем выбранного спонсора
        } else {
            setData({ ...data, [field]: value });
        }
    };

    const getFreePositions = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API_URL}/api/v1/participants/find_free_positions/${participantId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);

            setFreePositions(response.data.available_positions);
            setFilteredPositions(response.data.available_positions);
        } catch (error) {
            console.error('Ошибка при получении номера участника:', error);
        }
    };

    const handleSubmit = async (event) => {
        const token = localStorage.getItem('authToken');
        event.preventDefault();
        try {
            const response = await axios.put(`${API_URL}/api/v1/participant/add/structure`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);

            setActiveComponent({ name: 'Регистрации', id: null });
        } catch (error) {
            console.error('Ошибка при создании участника:', error.response?.data || error);
            setErrorMessage('Данные уже существуют или не все поля заполнены корректно.')
        }
    };

    const handleBack = (name, id) => {
        setActiveComponent({ name, id });
    };

    const getPakets = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API_URL}/api/v1/pakets`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPakets(response.data);
        } catch (error) {
            console.error('Error getting pakets:', error);
        }
    };

    useEffect(() => {
        getPakets();
        getFreePositions();
    }, []);

    return (
        <div>
            <div className={styles.participantsContainer}>
                <form
                    className={styles.formSection}
                    onSubmit={handleSubmit}
                >
                    <h3>Добавить в структуру</h3>
                    <div className={styles.formBlock}>
                        <div className={styles.formRow}>
                            <label>Пакет</label>
                            <select
                                value={data.paket_id}
                                onChange={(e) => handleChange('paket_id', parseInt(e.target.value))}
                            >
                                <option value="">Выберите пакет</option>
                                {pakets.map(paket => (
                                    <option key={paket.id} value={paket.id}>{paket.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formRow}>
                            <label>Поиск наставника</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => handleChange('search', e.target.value)}
                            />
                        </div>
                        <div className={styles.selectWrapper}>
                            {filteredPositions.map((item) => (
                                <div className={styles.select} key={item.id}>
                                    <button
                                        onClick={() => handleChange('sponsor_id', item.id)}
                                        type="button"
                                        style={{ backgroundColor: selectedSponsor === item.id && 'lightblue' }}
                                    >
                                        Наставник: {item.personal_number} {item.name} {item.position}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className={styles.formRow}>
                            <label>Выберите сторону</label>
                            <select
                                value={data.position}
                                onChange={(e) => handleChange('position', e.target.value)}
                                required
                            >
                                <option>Выберите сторону</option>
                                <option value="right">Правая</option>
                                <option value="left">Левая</option>
                            </select>
                        </div>
                    </div>
                    <footer className={styles.formButtons}>
                        <span>{errorMessage}</span>
                        <button type="button" onClick={() => handleBack('Регистрации', null)}>Назад</button>
                        <button type="submit">
                            Добавить в структуру
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    )
}

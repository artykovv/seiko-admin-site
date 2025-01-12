'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '@/constants/constants';
import styles from '../../Participants/Participants.module.css';

export default function EmployeesEdit({ participantId, setActiveComponent }) {
    const [participant, setParticipant] = useState({
        password: "",
        email: "",
        is_active: null,
        is_superuser: null,
        is_verified: null,
        name: "",
        lastname: "",
        patronymic: "",
        branch: "",
        phone_number: ""
    });
    const [loading, setLoading] = useState(false);

    const handleEditParticipant = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API}/users/${participantId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setParticipant(response.data);
        } catch (error) {
        }
    };

    useEffect(() => {
        if (participantId) {
            handleEditParticipant();
        }
    }, [participantId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Start loading

        const token = localStorage.getItem('authToken');
        try {
            const booleanValue = (value) => {
                if (value === true || value === 'true' || value === 1) return true;
                return false;
            };

            const submitData = {
                name: participant.name,
                lastname: participant.lastname,
                patronymic: participant.patronymic || null,
                login: participant.email,
                email: participant.email,
                phone_number: participant.phone_number,
                is_active: booleanValue(participant.is_active),
                is_superuser: booleanValue(participant.is_superuser),
            };

            if (participant.password) {
                submitData.password = participant.password;
                submitData.password_confirmation = participant.password_confirmation;
            }

            const response = await axios.patch(
                `${API}/users/${participantId}`,
                submitData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Данные успешно изменены')
                handleBack('Сотрудники');
            }
        } catch (error) {
            error('Ошибка при обновлении участника:', error.response?.data || error);
        } finally {
            setLoading(false); // Stop loading after request
        }
    };

    const handleBack = (name, id) => {
        setActiveComponent({ name, id });
    };

    const handleChange = (field, value) => {
        setParticipant(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className={styles.participantsContainer}>
            <form
                className={styles.formSection}
                onSubmit={handleSubmit}
            >
                <div className={styles.formBlock}>
                    <div className={styles.formRow}>
                        <label>Имя</label>
                        <input
                            type="text"
                            value={participant?.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label>Фамилия</label>
                        <input
                            type="text"
                            value={participant?.lastname || ''}
                            onChange={(e) => handleChange('lastname', e.target.value)}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label>Отчество</label>
                        <input
                            type="text"
                            value={participant?.patronymic || ''}
                            onChange={(e) => handleChange('patronymic', e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.formBlock}>
                    <div className={styles.formRow}>
                        <label>Почта</label>
                        <input
                            type="email"
                            autoComplete='username'
                            value={participant?.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className={styles.formBlock}>
                    <div className={styles.formRow}>
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="new-password"
                            onChange={(e) => handleChange('password', e.target.value)}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label htmlFor="repeatPassword">Повторить пароль</label>
                        <input
                            type="password"
                            id="repeatPassword"
                            name="password"
                            autoComplete="new-password"
                            onChange={(e) => handleChange('password_confirmation', e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.formBlock}>
                    <div className={styles.formRow}>
                        <label>Номер телефона</label>
                        <input
                            type="text"
                            value={participant?.phone_number || ''}
                            onChange={(e) => handleChange('phone_number', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className={styles.formBlock}>
                    <div className={styles.formRow}>
                        <label>Филиал</label>
                        <input
                            type="text"
                            value={participant?.branch || ''}
                            onChange={(e) => handleChange('branch', e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.formBlock}>
                    <div className={styles.formRow}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                checked={!!participant.is_active}
                                onChange={(e) => handleChange('is_active', e.target.checked)}
                            />
                            <span>Активный</span>
                        </label>
                    </div>

                    <div className={styles.formRow}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                checked={!!participant.is_superuser}
                                onChange={(e) => handleChange('is_superuser', e.target.checked)}
                            />
                            <span>Суперпользователь</span>
                        </label>
                    </div>
                </div>
                <footer className={styles.formButtons}>
                    <button type="button" onClick={() => handleBack('Сотрудники')}>
                        Назад
                    </button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </footer>
            </form>
        </div>
    );
}

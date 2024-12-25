import React, { useState } from 'react';
import styles from '../../Registrations/Registrations.module.css';
import axios from 'axios';
import { API_URL } from '@/api/api';

export default function EmployeesAdd({ setActiveComponent }) {
    const [data, setData] = useState({
        email: '',
        password: '',
        repeatPassword: '',  // добавлено поле для повторного пароля
        is_active: false,
        is_superuser: false,
        is_verified: false,
        name: '',
        lastname: '',
        patronymic: '',
        branch: '',
        phone_number: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState(null);  // для ошибки при несоответствии паролей

    const handleChange = (field, value) => {
        setData(prevData => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPasswordError(null);

        // Проверка совпадения паролей
        if (data.password !== data.repeatPassword) {
            setPasswordError('Пароли не совпадают');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/register`, data);
            handleBack('Сотрудники');
        } catch (error) {
            setError(error.response?.data?.message || 'Произошла ошибка при регистрации');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = (name, id) => {
        setActiveComponent({ name, id });
    };

    return (
        <div className={styles.participantsContainer}>
            <form className={styles.formSection} onSubmit={handleSubmit}>
                <div className={styles.formBlock}>
                    <div className={styles.formRow}>
                        <label>Имя</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label>Фамилия</label>
                        <input
                            type="text"
                            value={data.lastname}
                            onChange={(e) => handleChange('lastname', e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label>Отчество</label>
                        <input
                            type="text"
                            value={data.patronymic}
                            onChange={(e) => handleChange('patronymic', e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.formBlock}>
                    <div className={styles.formRow}>
                        <label>Почта</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label>Пароль</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label>Повторите пароль</label>
                        <input
                            type="password"
                            value={data.repeatPassword}
                            onChange={(e) => handleChange('repeatPassword', e.target.value)}
                            required
                        />
                    </div>
                </div>

                {passwordError && <p className={styles.error}>{passwordError}</p>}

                <div className={styles.formBlock}>
                    <div className={styles.formRow}>
                        <label>Номер телефона</label>
                        <input
                            type="text"
                            value={data.phone_number}
                            onChange={(e) => handleChange('phone_number', e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label>Филиал</label>
                        <input
                            type="text"
                            value={data.branch}
                            onChange={(e) => handleChange('branch', e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.formBlock}>
                    <div className={styles.formRow}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => handleChange('is_active', e.target.checked)}
                            />
                            Активный
                        </label>
                    </div>

                    <div className={styles.formRow}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input
                                type="checkbox"
                                checked={data.is_superuser}
                                onChange={(e) => handleChange('is_superuser', e.target.checked)}
                            />
                            Суперпользователь
                        </label>
                    </div>

                    <div className={styles.formRow}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input
                                type="checkbox"
                                checked={data.is_verified}
                                onChange={(e) => handleChange('is_verified', e.target.checked)}
                            />
                            Проверен
                        </label>
                    </div>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <footer className={styles.formButtons}>
                    <button type="button" onClick={() => handleBack('Сотрудники')} disabled={loading}>
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

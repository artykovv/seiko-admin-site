'use client'
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API } from '@/constants/constants';
import styles from '../Participants.module.css';

export default function ParticipantEdit({ participantId, setActiveComponent }) {
    const [participant, setParticipant] = useState({
        name: '',
        lastname: '',
        patronymic: '',
        email: '',
        personal_number: '',
        birth_date: '',
        pin: '',
        passport_id: '',
        passport_issue_date: '',
        passport_issuer: '',
        phone_number: '',
        bank: '',
        ip_inn: null,
        pensioner: null,
        number: '',
        branch: { id: '' },
        paket: { id: '' },
        sponsor: null
    });
    console.log(participant);

    const [branches, setBranches] = useState([]);

    const [searchResults, setSearchResults] = useState([]);
    const searchInputRef = useRef();

    const handleSearch = async () => {
        const token = localStorage.getItem('authToken');
        const query = searchInputRef.current?.value;
        if (!query) return;

        try {
            const response = await axios.get(`${API}/api/v1/search/participants?query=${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data.participants || []);
            setSearchResults(response.data.participants || []);
        } catch (error) {
            console.error('Ошибка поиска:', error);
        }
    };

    const selectSponsor = (sponsor) => {
        setParticipant((prev) => ({
            ...prev,
            sponsor
        }));
        if (searchInputRef.current) {
            searchInputRef.current.value = `${sponsor.name || ''} ${sponsor.lastname || ''} ${sponsor.patronymic || ''} (${sponsor.personal_number || ''})`.trim();
        }
        setSearchResults([]);
    };

    const handleEditParticipant = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API}/api/v1/participants/${participantId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const participantData = response.data;
            setParticipant(participantData);

            if (participantData.sponsor && searchInputRef.current) {
                searchInputRef.current.value = `${participantData.sponsor.name || ''} ${participantData.sponsor.lastname || ''} ${participantData.sponsor.patronymic || ''} (${participantData.sponsor.personal_number || ''})`.trim();
            }
        } catch (error) {
            console.error('Ошибка загрузки участника:', error);
        }
    };

    const handleChange = (field, value) => {
        if (field === 'branch_id') {
            setParticipant(prev => ({
                ...prev,
                branch: { id: value }
            }));
        } else if (field === 'paket_id') {
            setParticipant(prev => ({
                ...prev,
                paket: { id: value }
            }));
        } else {
            setParticipant(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleDateChange = (field, part, value) => {
        const date = participant[field] ? new Date(participant[field]) : new Date();

        switch (part) {
            case 'month':
                date.setMonth(value - 1);
                break;
            case 'day':
                date.setDate(value);
                break;
            case 'year':
                date.setFullYear(value);
                break;
        }

        handleChange(field, date.toISOString());
    };

    const getBranches = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API}/api/v1/branches`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBranches(response.data);
        } catch (error) {
        }
    };

    const validateForm = () => {
        const requiredFields = [
            'name',
            'lastname',
            'email',
            'phone_number',
            'birth_date',
            'pin',
            'passport_id',
            'passport_issue_date',
            'passport_issuer',
            'branch_id',
            'paket_id'
        ];

        const missingFields = requiredFields.filter(field => {
            if (field === 'branch_id') return !participant.branch?.id;
            if (field === 'paket_id') return !participant.paket?.id;
            return !participant[field];
        });

        if (missingFields.length > 0) {
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('authToken');
        if (!validateForm()) {
            console.error('Форма не прошла валидацию.');
            return;
        }

        try {
            const formatDate = (dateString) => {
                if (!dateString) return null;
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            };

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
                address: participant.address || null,
                birth_date: formatDate(participant.birth_date),
                pin: participant.pin,
                passport_id: participant.passport_id,
                passport_issuer: participant.passport_issuer,
                passport_issue_date: formatDate(participant.passport_issue_date),
                bank: participant.bank || null,
                ip_inn: booleanValue(participant.ip_inn),
                pensioner: booleanValue(participant.pensioner),
                paket_id: parseInt(participant.paket?.id),
                branch_id: parseInt(participant.branch?.id),
                code: participant.code || null,
                sponsor_id: participant.sponsor?.id // Отправляем ID спонсора
            };

            if (participant.password) {
                submitData.password = participant.password;
                submitData.password_confirmation = participant.password_confirmation;
            }

            const response = await axios.put(
                `${API}/api/v1/participants/${participantId}`,
                submitData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                handleBack('Участники', true);
            }
        } catch (error) {
            console.log(error);

        }
    };

    const handleBack = (name, id) => {
        setActiveComponent({ name, id });
    };

    useEffect(() => {
        if (participantId) {
            handleEditParticipant();
            getBranches();
        }

    }, [participantId]);


    return (
        <div className={styles.participantsContainer}>
            <form
                className={styles.formSection}
                onSubmit={handleSubmit}
            >
                <div className={styles.formBlock}>

                    <div className={styles.formRow}>
                        <label>Поиск спонсора</label>
                        <input
                            type="text"
                            ref={searchInputRef}
                            placeholder="Введите имя, фамилию или номер"
                            onChange={handleSearch}
                        />
                    </div>
                    {searchResults.length > 0 && (
                        <div className={styles.searchResults}>
                            {searchResults.map((item) => (
                                <div
                                    key={item.id}
                                    className={styles.searchResultItem}
                                    onClick={() => selectSponsor(item)}
                                >
                                    <span> {`${item.name || ''} ${item.lastname || ''}  ${item.patronymic || ''}  (${item.personal_number || ''})`}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={styles.formRow}>
                        <label>Филиал</label>
                        <select
                            value={participant?.branch?.id || ''}
                            onChange={(e) => handleChange('branch_id', e.target.value)}
                            required
                        >
                            <option value="">Выберите филиал</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formRow}>
                        <label>Номер участника</label>
                        <input
                            type="text"
                            value={participant?.number}
                            disabled
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label>Пакет</label>
                        <input
                            type="text"
                            value={participant?.paket?.name || ''}
                            disabled
                        />
                    </div>
                </div>

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
                        <label>Email</label>
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
                            placeholder="Оставте пустым для сохранения старого пароля"
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
                        <label>Личная информация</label>
                        <input
                            type="text"
                            value={participant?.personal_number || ''}
                            onChange={(e) => handleChange('personal_number', e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.formBlock}>
                    <label>Дата рждения</label>
                    <div className={styles.dateInputs}>
                        <input
                            type="number"
                            placeholder="Месяц"
                            value={participant?.birth_date ? new Date(participant.birth_date).getMonth() + 1 : ''}
                            onChange={(e) => handleDateChange('birth_date', 'month', e.target.value)}
                            required
                            min="1"
                            max="12"
                        />
                        <input
                            type="number"
                            placeholder="День"
                            value={participant?.birth_date ? new Date(participant.birth_date).getDate() : ''}
                            onChange={(e) => handleDateChange('birth_date', 'day', e.target.value)}
                            required
                            min="1"
                            max="31"
                        />
                        <input
                            type="number"
                            placeholder="Год"
                            value={participant?.birth_date ? new Date(participant.birth_date).getFullYear() : ''}
                            onChange={(e) => handleDateChange('birth_date', 'year', e.target.value)}
                            required
                            min="1900"
                            max="2100"
                        />
                    </div>
                </div>

                <div className={styles.formBlock}>
                    <div className={styles.formRow}>
                        <label>ИНН/ПИН</label>
                        <input
                            type="text"
                            value={participant?.pin || ''}
                            onChange={(e) => handleChange('pin', e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.formBlock}>
                    <div className={styles.formRow}>
                        <label>Паспорт ID</label>
                        <input
                            type="text"
                            value={participant?.passport_id || ''}
                            onChange={(e) => handleChange('passport_id', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className={styles.formBlock}>
                    <label>Дата выдачи документа</label>
                    <div className={styles.dateInputs}>
                        <input
                            type="number"
                            placeholder="Месяц"
                            value={participant?.passport_issue_date ? new Date(participant.passport_issue_date).getMonth() + 1 : ''}
                            onChange={(e) => handleDateChange('passport_issue_date', 'month', e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="День"
                            value={participant?.passport_issue_date ? new Date(participant.passport_issue_date).getDate() : ''}
                            onChange={(e) => handleDateChange('passport_issue_date', 'day', e.target.value)}
                            required
                            min="1"
                            max="31"
                        />
                        <input
                            type="number"
                            placeholder="Год"
                            value={participant?.passport_issue_date ? new Date(participant.passport_issue_date).getFullYear() : ''}
                            onChange={(e) => handleDateChange('passport_issue_date', 'year', e.target.value)}
                            required
                            min="1900"
                            max="2100"
                        />
                    </div>
                </div>

                <div className={styles.formBlock}>
                    <div className={styles.formRow}>
                        <label>Кем выдан документ</label>
                        <input
                            type="text"
                            value={participant?.passport_issuer || ''}
                            onChange={(e) => handleChange('passport_issuer', e.target.value)}
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
                        <label>Банк</label>
                        <input
                            type="text"
                            value={participant?.bank || ''}
                            onChange={(e) => handleChange('bank', e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.formBlock}>
                    <div className={styles.formRow}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                checked={!!participant.ip_inn}
                                onChange={(e) => handleChange('ip_inn', e.target.checked)}
                            />
                            <span>ИП</span>
                        </label>
                    </div>

                    <div className={styles.formRow}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                checked={!!participant.pensioner}
                                onChange={(e) => handleChange('pensioner', e.target.checked)}
                            />
                            <span>Пенсионер</span>
                        </label>
                    </div>
                </div>
                <footer className={styles.formButtons}>
                    <button type="button" onClick={() => handleBack('Участники')}>
                        Назад
                    </button>
                    <button type="submit">
                        Сохранить
                    </button>
                </footer>
            </form>
        </div>
    );
}



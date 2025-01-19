import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { API } from '@/constants/constants';
import styles from '../Participants.module.css';
import toast from 'react-hot-toast';
import { debounce, set } from 'lodash';

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
        sponsor: null,
    });

    const [branches, setBranches] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const searchInputRef = useRef();
    const [searchValue, setSearchValue] = useState('');
    const [isSponsorListVisible, setIsSponsorListVisible] = useState(false);

    const getBranches = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API}/api/v1/branches`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBranches(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const formatDate = (date) => (date ? new Date(date).toISOString().split('T')[0] : '');

    const handleChange = (field, value) => {
        setParticipant(prev => ({
            ...prev,
            [field]: value
        }));
        if (field === 'branch') {
            console.log(value);

            setParticipant(prev => ({
                ...prev,
                branch: { id: value },
                address: value
            }));
        }
    };

    const handleDateChange = (field, value) => {
        handleChange(field, value ? new Date(value).toISOString() : '');
    };

    const debouncedHandleSearch = useMemo(() =>
        debounce(async (query) => {
            const token = localStorage.getItem('authToken');
            if (!query) return;

            try {
                const response = await axios.get(`${API}/api/v1/search/participants?query=${query}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSearchResults(response.data.participants || []);
            } catch (error) {
                console.error(error);
            }
        }, 300), []);

    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        searchInputRef.current = query;
        setSearchValue(query);
        debouncedHandleSearch(query);
        setIsSponsorListVisible(true);
    };

    const handleEditParticipant = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API}/api/v1/participants/${participantId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const participantData = response.data;
            setParticipant({
                ...participantData,
                birth_date: formatDate(participantData.birth_date),
                passport_issue_date: formatDate(participantData.passport_issue_date),
                sponsor: participantData.sponsor.id
            });
            const sponsor = `${participantData.sponsor.name} ${participantData.sponsor.lastname} ${participantData.sponsor.patronymic} ${participantData.sponsor.personal_number}`;
            setSearchValue(sponsor);
            // if (participantData.sponsor && searchInputRef.current) {
            //     searchInputRef.current.value = `${participantData.sponsor.name || ''} ${participantData.sponsor.lastname || ''
            //         } ${participantData.sponsor.patronymic || ''} (${participantData.sponsor.personal_number || ''})`.trim();
            // }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectSponsor = (value) => {
        setParticipant(prev => ({
            ...prev,
            sponsor: value,
        }));
        const selected = searchResults.find((item) => item.id === value);
        if (selected) {
            const sponsorDetails = `${selected.name} ${selected.lastname} ${selected.patronymic} ${selected.personal_number}`;
            setSearchValue(sponsorDetails);
            setIsSponsorListVisible(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('authToken');

        try {
            const submitData = {
                ...participant,
                birth_date: participant.birth_date,
                passport_issue_date: participant.passport_issue_date,
                paket_id: parseInt(participant.paket?.id),
                branch: parseInt(participant.branch?.id),
                ip_inn: Boolean(participant.ip_inn),
                pensioner: Boolean(participant.pensioner),
            };

            const response = await axios.put(`${API}/api/v1/participants/${participantId}`, submitData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setActiveComponent({ name: 'Участники' });
                toast.success('Данные успешно обновлены');
            }
        } catch (error) {
            console.error('Ошибка отправки данных:', error);
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
                            value={searchValue}
                            placeholder="Поиск"
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                handleSearchInputChange(e);
                            }}
                        />
                    </div>

                    {isSponsorListVisible && searchResults.length > 0 && (
                        <div className={styles.searchResults}>
                            {searchResults.map((item) => (
                                <div
                                    key={item.id}
                                    className={styles.searchResultItem}
                                    onClick={() => handleSelectSponsor(item.id)}
                                >
                                    <span>{`${item.name || ''} ${item.lastname || ''} ${item.patronymic || ''} (${item.personal_number || ''})`}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={styles.formRow}>
                        <label>Филиал</label>
                        <select
                            value={participant?.branch?.id || ''}
                            onChange={(e) => handleChange('branch', e.target.value)}
                            required
                        >
                            <option value="">Выберите филиал</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.code} {branch.name}</option>
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
                    <label>Дата рождения</label>
                    <div className={styles.dateInputs}>
                        <input
                            style={{ width: '100%' }}
                            type="date"
                            value={participant.birth_date ? participant.birth_date.split('T')[0] : ''}
                            onChange={(e) => handleDateChange('birth_date', e.target.value)}
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
                            style={{ width: '100%' }}
                            type="date"
                            value={participant.passport_issue_date ? participant.passport_issue_date.split('T')[0] : ''}
                            onChange={(e) => handleDateChange('passport_issue_date', e.target.value)}
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



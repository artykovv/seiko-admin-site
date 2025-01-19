import React, { useState, useEffect } from 'react'
import styles from '../Registrations.module.css'
import axios from 'axios';
import { API } from '@/constants/constants';
import toast from 'react-hot-toast';

export default function AddStructure({ setActiveComponent, participantId, sponsorId, paketId }) {
    const [errorMessage, setErrorMessage] = useState('')
    const [pakets, setPakets] = useState([]);
    const [freePositions, setFreePositions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPositions, setFilteredPositions] = useState([]);
    const [isActiveSelect, setIsActiveSelect] = useState()
    const [isSponsorListVisible, setIsSponsorListVisible] = useState(false);

    const [data, setData] = useState({
        mentor_id: '',
        paket_id: parseInt(paketId),
        participant_id: parseInt(participantId),
        position: '',
        sponsor_id: ''
    })

    const filterPositions = (term) => {
        if (!Array.isArray(freePositions)) {
            return;
        }
        const lowerCaseTerm = term.toLowerCase();
        const filtered = freePositions.filter(position =>
            position.name.toLowerCase().includes(lowerCaseTerm) ||
            position.lastname.toLowerCase().includes(lowerCaseTerm) ||
            position.patronymic.toLowerCase().includes(lowerCaseTerm) ||
            position.personal_number.toLowerCase().includes(lowerCaseTerm)
        );
        setFilteredPositions(filtered);
    };

    const handleSelectSponsor = (field, value, position) => {
        if (field === 'sponsor_id') {
            setIsActiveSelect(position);

            const selected = freePositions.find((item) => item.id === value);
            if (selected) {
                let positionText;
                switch (position) {
                    case 'left':
                        positionText = 'левая';
                        break;
                    case 'right':
                        positionText = 'правая';
                        break;
                    case 'both':
                        positionText = 'оба';
                        break;
                    default:
                        positionText = 'неизвестно';
                }

                const sponsorDetails = `${selected.name} ${selected.lastname} ${selected.patronymic} ${selected.personal_number} ${positionText}`;
                setSearchTerm(sponsorDetails);
                setIsSponsorListVisible(false);
            }

            setData(prevData => ({
                ...prevData,
                [field]: value,
                mentor_id: value,
            }));
        }
    };

    const handleChange = (field, value) => {
        switch (field) {
            case 'search':
                setSearchTerm(value);
                filterPositions(value);
                setIsSponsorListVisible(true);
                break;
            case 'position':
                setData(prevData => ({
                    ...prevData,
                    [field]: value,
                }));
                break;

            default:
                setData(prevData => ({ ...prevData, [field]: value }));
                break;
        }
    };

    const getFreePositions = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API}/api/v1/participants/find_free_positions/${sponsorId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setFreePositions(response.data.available_positions);
            setFilteredPositions(response.data.available_positions);
        } catch (error) {
        }
    };

    const handleSubmit = async (event) => {
        const token = localStorage.getItem('authToken');
        event.preventDefault();
        try {
            const response = await axios.put(`${API}/api/v1/participant/add/structure`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                toast.success("Данные успешно обновлены");
                handleBack('Регистрации');
            }
        } catch (error) {
            setErrorMessage('Данные уже существуют или не все поля заполнены корректно.')
        }
    };

    const handleBack = (name, id) => {
        setActiveComponent({ name, id });
    };

    const getPakets = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API}/api/v1/pakets`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPakets(response.data);
        } catch (error) {
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
                            {isSponsorListVisible && filteredPositions.length > 0 && (
                                <div className={styles.searchResults}>
                                    {filteredPositions.map((item) => {
                                        let positionText;
                                        switch (item.position) {
                                            case 'left':
                                                positionText = 'левая';
                                                break;
                                            case 'right':
                                                positionText = 'правая';
                                                break;
                                            case 'both':
                                                positionText = 'оба';
                                                break;
                                            default:
                                                positionText = 'неизвестно';
                                        }

                                        return (
                                            <div className={styles.select} key={item.id}>
                                                <button
                                                    onClick={() => handleSelectSponsor('sponsor_id', item.id, item.position)}
                                                    type="button"
                                                >
                                                    Наставник: {item.name} {item.lastname} {item.patronymic} {item.personal_number} {positionText}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className={styles.formRow}>
                            <label>Выберите сторону</label>
                            <select
                                value={data.position}
                                onChange={(e) => handleChange('position', e.target.value, isActiveSelect)}
                                required
                            >
                                <option value="">Выберите сторону</option>
                                {isActiveSelect === 'both' && (
                                    <>
                                        <option value="right">Правая</option>
                                        <option value="left">Левая</option>
                                    </>
                                )}
                                {isActiveSelect === 'left' && (
                                    <option value="left">Левая</option>
                                )}
                                {isActiveSelect === 'right' && (
                                    <option value="right">Правая</option>
                                )}
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

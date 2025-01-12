

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '@/constants/constants';
import styles from "../Participants.module.css";
import toast  from 'react-hot-toast';

const ParticipantStructure = ({ participantId, setActiveComponent }) => {
    const [state, setState] = useState(null);
    const [participantDetail, setParticipantDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDetailOpenTwo, setIsDetailOpenTwo] = useState(false);
    const [participantDetailTwo, setParticipantDetailTwo] = useState(null);
    const [resultBinary, setResultBinary] = useState(null);
    console.log(resultBinary);

    const getStructure = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const { data } = await axios.get(
                `${API}/api/v1/participants/${participantId}/children`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            setState(data);
        } catch (error) {
        }
    };

    useEffect(() => {
        getStructure();
    }, [participantId]);



    const handleDetailOne = async (detailStructureId) => {
        const token = localStorage.getItem("authToken");
        toast.loading('Загрузка...', { duration: 1000, });
        try {
            const response = await axios.get(
                `${API}/api/v1/participants/${detailStructureId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setParticipantDetail(response.data);
            setIsDetailOpen(true);
        } catch (error) {
            toast.error('Ошибка при загрузке.', { duration: 2000, })
        }
    };

    const handleDetailTwo = async (detailStructureId) => {
        const token = localStorage.getItem("authToken");
        toast.loading('Загрузка...', { duration: 1000, });
        try {
            const result = await axios.get(`${API}/api/v1/binar-bonuse/calculate/${detailStructureId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                })
            const response = await axios.get(
                `${API}/api/v1/participant/${detailStructureId}/turnover/details`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setResultBinary(result.data)
            setParticipantDetailTwo(response.data);
            setIsDetailOpenTwo(true);
        } catch (error) {
            toast.error('Ошибка при загрузке.', { duration: 2000, })
        }
    };

    const handleParticipantPage = (name, id) => {
        setActiveComponent({ name, id });
    };


    const renderNode = (node) => (
        <div className={styles.node}>
            <div
                className={styles.trr}
                style={{ background: `linear-gradient(180deg, ${node.color})` }}
            >
                <span onClick={() => handleParticipantPage('participantStructure', node.participant_id)}>{node.participant_name}</span>
                <span onClick={() => handleParticipantPage('participantStructure', node.participant_id)}>{node.participant_lastname}</span>
                <button onClick={() => handleDetailOne(node.participant_id)}>{node.participant_personal_number}</button>
                <button onClick={() => handleDetailTwo(node.participant_id)}>Подробности</button>
            </div>
        </div>
    );

    const renderTree = (node) => {
        if (!node) return null;

        return (
            <li>
                {renderNode(node)}
                <ul className={styles.active}>
                    {node.left_child && <>{renderTree(node.left_child)}</>}
                    {node.right_child && <>{renderTree(node.right_child)}</>}
                </ul>
            </li>
        );
    };

    const handleBack = (name, id) => {
        setActiveComponent({ name, id });
    };

    return (
        <div className={styles.participantsContainer}>
            <div className={styles.tableSection}>
                <div className={styles.tableIn}>
                    {isDetailOpen && (
                        <div
                            className={styles.detailModal}
                            onClick={() => setIsDetailOpen(false)}
                        >
                            <div
                                className={styles.detailModalContent}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className={styles.detailModalHeader}>
                                    <h2>Детали участника</h2>
                                </div>
                                <div className={styles.detailModalBody}>
                                    <p>{participantDetail.name} {participantDetail.lastname} {participantDetail.patronymic}</p>
                                    <p>{participantDetail.personal_number}</p>
                                    <p><strong>Пакет</strong> : {participantDetail.paket.name}</p>
                                    <p><strong>Статус</strong> : {participantDetail.status.name}</p>
                                    <p> <strong>Спонсор</strong>: {participantDetail.sponsor ? participantDetail.sponsor.name : 'Не указано'} {participantDetail.sponsor ? participantDetail.sponsor.lastname : 'не указано'}</p>
                                    <p> <strong>Наставник</strong>: {participantDetail.mentor ? participantDetail.mentor.name : 'Не указано'} {participantDetail.mentor ? participantDetail.mentor.lastname : 'не указано'}</p>
                                    <p><strong>Логин</strong> : {participantDetail.email}</p>
                                    <p><strong>Личная информация</strong> : {participantDetail.personal_info}</p>
                                    <p><strong>Дата рождения</strong> : {participantDetail.birth_date}</p>
                                    <p><strong>Телефон</strong> : {participantDetail.phone_number}</p>
                                    <p><strong>Филиал</strong> : {participantDetail.branch.name}</p>
                                    <p><strong>Банк. Номер (Мбанк)</strong> : {participantDetail.bank}</p>
                                    <p><strong>Левый ТО</strong> : {participantDetail.left_volume}</p>
                                    <p><strong>Парвый ТО</strong> : {participantDetail.right_volume}</p>
                                </div>
                                <div className={styles.detailModalFooter}>
                                    <button
                                        className={styles.closeDetailBtn}
                                        onClick={() => setIsDetailOpen(false)}
                                    >
                                        Закрыть
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isDetailOpenTwo && (
                        <div
                            className={styles.detailModal}
                            onClick={() => setIsDetailOpenTwo(false)}
                        >
                            <div
                                className={styles.detailModalContent}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className={styles.detailModalHeader}>
                                    <h2>Подробности</h2>
                                </div>
                                <div className={styles.detailModalBody}>
                                    <p><strong>Статус</strong> : {participantDetailTwo.paket}</p>
                                    <p>Количество участников</p>
                                    <p><strong>Левый ветка</strong> : {participantDetailTwo.descendants.left_descendants}</p>
                                    <p><strong>Парвый ветка</strong> : {participantDetailTwo.descendants.right_descendants}</p>
                                    <p>Общий ТО</p>
                                    <p><strong>Левый ветка</strong> : {participantDetailTwo.left_volume}</p>
                                    <p><strong>Парвый ветка</strong> : {participantDetailTwo.right_volume}</p>
                                    <p><strong>Количество личников</strong> : {participantDetailTwo.sponsored}</p>
                                    <p><strong>Бонус за бинар на данный момент</strong> : {resultBinary.binar.bonus}</p>
                                    <p><strong>Бонус за чек от чека на данный момент</strong> : {resultBinary.cheque.total_bonus}</p>
                                </div>
                                <div className={styles.detailModalFooter}>
                                    <button
                                        className={styles.closeDetailBtn}
                                        onClick={() => setIsDetailOpenTwo(false)}
                                    >
                                        Закрыть
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={styles.genealogyBody}>
                        <div className={styles.genealogyTree}>
                            <ul>
                                {state ? renderTree(state) : <p>Загрузка...</p>}
                            </ul>
                        </div>
                    </div>
                    <footer className={styles.formButtons}>
                        <button type="button" onClick={() => handleBack('Участники')}>
                            Назад
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ParticipantStructure;

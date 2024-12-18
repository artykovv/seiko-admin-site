'use client'
import { useEffect, useState } from "react"
import React from 'react'
import axios from "axios";
import { API_URL } from "@/api/api";
import styles from '../Participants.module.css'

export default function ParticipantStructure({ participantId, setActiveComponent }) {
    const [firstChild, setFirstChild] = useState([]);
    const [leftChild, setLeftChildren] = useState([]);
    const [rightChild, setRightChildren] = useState([]);

    console.log(firstChild.color);
    console.log(leftChild);
    console.log(rightChild);

    const getStructure = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API_URL}/api/v1/participants/${participantId}/children`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const firstChild = response.data;
            const children = []; // Динамический массив для всех детей

            if (firstChild.left_child) {
                children.push(firstChild.left_child); // Добавляем левого ребенка, если он существует
            }

            if (firstChild.right_child) {
                children.push(firstChild.right_child); // Добавляем правого ребенка, если он существует
            }

            setFirstChild(firstChild); // Устанавливаем основного участника
            setLeftChildren(firstChild.left_child); // Левого ребенка, если нужно
            setRightChildren(firstChild.right_child); // Правого ребенка, если нужно

        } catch (error) {
            console.error('Ошибка при загрузке участников:', error);
        }
    };

    useEffect(() => {
        getStructure();
    }, []);

    const [participantDetail, setParticipantDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleOpenDetail = async (detailStructureId) => {
        const token = localStorage.getItem('authToken');
        try {
            const cachedDetail = localStorage.getItem(`strucutreFirstChild${detailStructureId}`);
            if (cachedDetail) {
                setParticipantDetail(JSON.parse(cachedDetail));
                setIsDetailOpen(true);
                return;
            }

            const response = await axios.get(`${API_URL}/api/v1/participant/${detailStructureId}/turnover/details`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            localStorage.setItem(`strucutreFirstChild${detailStructureId}`, JSON.stringify(response.data));
            setParticipantDetail(response.data);
            setIsDetailOpen(true);
        } catch (error) {
            console.error('Ошибка при открытии деталей участника:', error);
        }
    }

    const handleBack = (name, id) => {
        setActiveComponent({ name, id });
    };

    return (
        <div className={styles.participantsContainer}>
            <div className={styles.tableSection}>
                <div className={styles.tableIn}>
                    {isDetailOpen && <div className={styles.detailModal} onClick={() => setIsDetailOpen(false)}>
                        <div className={styles.detailModalContent} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.detailModalHeader}>
                                <h2>Подробности</h2>
                            </div>
                            <div className={styles.detailModalBody}>
                                <p> <strong>Статус:</strong> BUSINESS</p>
                                <p> <strong>Количество участников:</strong> {participantDetail.descendants.left_descendants + participantDetail.descendants.right_descendants}</p>
                                <p> <strong>Левая ветка:</strong> {participantDetail.descendants.left_descendants}</p>
                                <p> <strong>Правая ветка:</strong> {participantDetail.descendants.right_descendants}</p>
                                <p> <strong>Общий ТО:</strong></p>
                                <p> <strong>Левая ветка:</strong> {participantDetail.left_volume}</p>
                                <p> <strong>Правая ветка:</strong> {participantDetail.right_volume}</p>
                                <p> <strong>Количество личников:</strong> {participantDetail.sponsored}</p>
                                <p> <strong>Бонус за бинар:</strong> {participantDetail.bonus_binar}</p>
                            </div>
                            <div className={styles.detailModalFooter}>
                                <button className={styles.closeDetailBtn} onClick={() => setIsDetailOpen(false)}>Закрыть</button>
                            </div>
                        </div>
                    </div>}
                    <footer className={styles.formButtons}>
                        <button type="button" onClick={() => handleBack('Участники')}>
                            Назад
                        </button>
                    </footer>
                    <div className={styles.childBlock}>
                        <div className={styles.firstChild} style={{ backgroundColor: `${firstChild.color}` }}>
                            <div className={styles.firstChildTitle}>
                                <span>{firstChild.participant_name}</span>
                                <span>{firstChild.participant_lastname}</span>
                                <span>{firstChild.participant_patronymic}</span>
                            </div>
                            <span className={styles.structurePersonalNumber}>{firstChild.participant_personal_number}</span>
                            <button className={styles.openDetailBtnChildren} onClick={() => handleOpenDetail(firstChild.participant_id)}>Подробнее</button>
                        </div>
                        <div className={styles.secondChild}>
                            <div className={styles.leftChild} style={{ backgroundColor: `${leftChild.color}` }}>
                                <div className={styles.firstChildTitle}>
                                    <span>{leftChild.participant_name}</span>
                                    <span>{leftChild.participant_lastname}</span>
                                    <span>{leftChild.participant_patronymic}</span>
                                </div>
                                <span className={styles.structurePersonalNumber}>{leftChild.participant_personal_number}</span>
                                <button className={styles.openDetailBtnChildren} onClick={() => handleOpenDetail(leftChild.participant_id)}>Подробнее</button>
                            </div>
                            <div className={styles.rightChild} style={{ backgroundColor: `${rightChild.color}` }}>
                                <div className={styles.firstChildTitle}>
                                    <span>{rightChild.participant_name}</span>
                                    <span>{rightChild.participant_lastname}</span>
                                    <span>{rightChild.participant_patronymic}</span>
                                </div>
                                <span className={styles.structurePersonalNumber}>{rightChild.participant_personal_number}</span>
                                <button className={styles.openDetailBtnChildren} onClick={() => handleOpenDetail(rightChild.participant_id)}>Подробнее</button>
                            </div>
                        </div>
                        {/* <div className={styles.thirdChild}>
                            <div className={styles.thirdLeftChild}>
                                <div className={styles.leftChild} style={{ backgroundColor: `${leftChild.left_childcolor}` }}>
                                    <div className={styles.firstChildTitle}>
                                        <span>{leftChild.left_childparticipant_name}</span>
                                        <span>{leftChild.left_childparticipant_lastname}</span>
                                        <span>{leftChild.left_childparticipant_patronymic}</span>
                                    </div>
                                    <span className={styles.structurePersonalNumber}>{leftChild.left_childparticipant_personal_number}</span>
                                    <button className={styles.openDetailBtnChildren} onClick={() => handleOpenDetail(leftChild.left_childparticipant_id)}>Подробнее</button>
                                </div>
                                <div className={styles.rightChild} style={{ backgroundColor: `${rightChild.color}` }}>
                                    <div className={styles.firstChildTitle}>
                                        <span>{rightChild.participant_name}</span>
                                        <span>{rightChild.participant_lastname}</span>
                                        <span>{rightChild.participant_patronymic}</span>
                                    </div>
                                    <span className={styles.structurePersonalNumber}>{rightChild.participant_personal_number}</span>
                                    <button className={styles.openDetailBtnChildren} onClick={() => handleOpenDetail(rightChild.participant_id)}>Подробнее</button>
                                </div>
                            </div>
                            <div className={styles.thirdRightChild}>
                                <div className={styles.leftChild} style={{ backgroundColor: `${leftChild.left_childcolor}` }}>
                                    <div className={styles.firstChildTitle}>
                                        <span>{leftChild.left_child.participant_name}</span>
                                        <span>{leftChild.left_childparticipant_lastname}</span>
                                        <span>{leftChild.left_childparticipant_patronymic}</span>
                                    </div>
                                    <span className={styles.structurePersonalNumber}>{leftChild.left_childparticipant_personal_number}</span>
                                    <button className={styles.openDetailBtnChildren} onClick={() => handleOpenDetail(leftChild.left_childparticipant_id)}>Подробнее</button>
                                </div>
                                <div className={styles.rightChild} style={{ backgroundColor: `${rightChild.color}` }}>
                                    <div className={styles.firstChildTitle}>
                                        <span>{rightChild.participant_name}</span>
                                        <span>{rightChild.participant_lastname}</span>
                                        <span>{rightChild.participant_patronymic}</span>
                                    </div>
                                    <span className={styles.structurePersonalNumber}>{rightChild.participant_personal_number}</span>
                                    <button className={styles.openDetailBtnChildren} onClick={() => handleOpenDetail(rightChild.participant_id)}>Подробнее</button>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

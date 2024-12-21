import React, { useEffect, useState } from 'react';
import styles from "../Employees.module.css";
import axios from 'axios';
import { API_URL } from '@/api/api';

export default function EmployeesPermissionsEdit({ participantId, setActiveComponent }) {
    const [userName, setUserName] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [checkedPermissions, setCheckedPermissions] = useState({});

    console.log(checkedPermissions);

    const handleBack = (name, id) => {
        setActiveComponent({ name, id });
    };

    const getPermissions = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const responseUser = await axios.get(`${API_URL}/users/${participantId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const permission = await axios.get(`${API_URL}/permissions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setUserName(responseUser.data);
            setPermissions(permission.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCheckboxChange = (id) => {
        setCheckedPermissions((prevState) => ({
            ...prevState,
            [id]: !prevState[id], // Инвертируем текущее состояние
        }));
    };

    useEffect(() => {
        getPermissions();
    }, []);

    return (
        <div className={styles.detailModal} onClick={() => handleBack('')}>
            <div className={styles.detailModalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.detailModalHeader}>
                    <h2>Права</h2>
                </div>
                <div className={styles.detailModalBody}>
                    <p>Сотрудник :  {userName.name} {userName.lastname} {userName.patronymic}</p>
                    {permissions.map((item, index) => (
                        <div key={index}>
                            <label className={styles.checkboxContainer}>
                                {item.permission_name}
                                <input
                                    className={styles.customCheckbox}
                                    type="checkbox"
                                    checked={!!checkedPermissions[item.id]}
                                    onChange={() => handleCheckboxChange(item.id)}
                                />
                                <span className={styles.checkmark}></span>
                            </label>
                        </div>
                    ))}
                </div>
                <div className={styles.detailModalFooter}>
                    <button className={styles.closeDetailBtn} onClick={() => handleBack('')}>Закрыть</button>
                </div>
            </div>
        </div>
    );
}

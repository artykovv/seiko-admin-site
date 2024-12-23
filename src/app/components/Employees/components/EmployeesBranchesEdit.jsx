import React, { useEffect, useState, useCallback } from 'react';
import styles from "../Employees.module.css";
import axios from 'axios';
import { API_URL } from '@/api/api';

export default function EmployeesBranchesEdit({ participantId, setActiveComponent }) {
    const [userInfo, setUserInfo] = useState({});
    const [permissions, setPermissions] = useState([]);
    const [checkedPermissions, setCheckedPermissions] = useState({});

    const handleBack = (name, id) => {
        setActiveComponent({ name, id });
    };

    const getPermissions = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        try {
            const userInfoResponse = await axios.get(`${API_URL}/users/${participantId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log(userInfoResponse);

            const permissionsResponse = await axios.get(`${API_URL}/api/v1/branches`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            setUserInfo(userInfoResponse.data);
            setPermissions(permissionsResponse.data);

            const userPermissionsIds = new Set(userInfoResponse.data.branches.map((perm) => perm.id));
            const initialCheckedPermissions = permissionsResponse.data.reduce((acc, perm) => {
                acc[perm.id] = userPermissionsIds.has(perm.id);
                return acc;
            }, {});
            setCheckedPermissions(initialCheckedPermissions);
        } catch (error) {
            console.error(error);
        }
    }, [participantId]);

    const handleCheckboxChange = async (id) => {
        const token = localStorage.getItem('authToken');
        const isChecked = !checkedPermissions[id];

        setCheckedPermissions((prevState) => {
            const updatedState = { ...prevState, [id]: isChecked };
            return updatedState;
        });

        try {
            const url = `${API_URL}/users/${participantId}/branch/${id}`;
            if (isChecked) {
                await axios.post(url, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            } else {
                await axios.delete(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            }
        } catch (error) {
            console.error('Ошибка при изменении разрешения:', error);
        }
    };

    useEffect(() => {
        getPermissions();
    }, [getPermissions]);

    return (
        <div className={styles.employeesContainer}>
            <div className={styles.tableSection}>
                <div className={styles.tableIn}>
                    <div className={styles.tableWrapper}>
                        <div >
                            <div className={styles.detailModalHeader}>
                                <h2>Доступ к филиалам</h2>
                            </div>
                            <div className={styles.detailModalBody}>
                                <p>Сотрудник : {userInfo.name} {userInfo.lastname} {userInfo.patronymic}</p>
                                {permissions.map((item) => (
                                    <div key={item.id}>
                                        <label className={styles.checkboxContainer}>
                                            {item.name}
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
                                <button className={styles.closeDetailBtn} onClick={() => handleBack('Сотрудники')}>Закрыть</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

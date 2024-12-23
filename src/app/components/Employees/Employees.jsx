import React, { useEffect, useState } from 'react';
import styles from './Employees.module.css';

import edit from '@/assets/edit.svg';
import add from '@/assets/add.webp';
import usersetting from '@/assets/usersetting.svg';
import geo from '@/assets/geo.svg';
import deletePng from '@/assets/delete.svg'


import Image from 'next/image';
import axios from 'axios';
import { API_URL } from '@/api/api';

function Employees({ setActiveComponent }) {
  const [users, setUsers] = useState([])

  const getEmployees = async () => {
    const token = localStorage.getItem('authToken')
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getEmployees()
  }, [])

  const handleParticipantPage = (name, id) => {
    setActiveComponent({ name, id });
  };

  const hanldeDelete = async (id) => {
    const token = localStorage.getItem('authToken')
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.employeesContainer}>
      <div className={styles.tableSection}>
        <div className={styles.tableIn}>
          <div className={styles.tableWrapper}>
            <div className={styles.btnsWrapper}>
              <button className={styles.addBtn} onClick={() => handleParticipantPage('EmployeesAdd', null)}>
                <Image src={add} alt="add" />
                Добавить
              </button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">ФИО</th>
                  <th scope="col">Логин</th>
                  <th scope="col">Город</th>
                  <th scope="col">Доступ в филиалы</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item, index) => (
                  <tr key={index}>
                    <td scope="row">{item.lastname} {item.userName} {item.patronymic}</td>
                    <td>{item.email}</td>
                    <td>{item.branch}</td>
                    <td>{item.branches.map(branch => branch.name).join(', ')}</td>
                    <td>{item.is_active === true ? 'Действует' : 'Не действует'}</td>
                    <td className={styles.actions}>
                      <button className={styles.btn}>
                        <Image src={usersetting} alt="usersetting" onClick={() => handleParticipantPage('EmployeesPermissionsEdit', item.id)} />
                      </button>
                      <button className={styles.btn}>
                        <Image src={geo} alt="geo" onClick={() => handleParticipantPage('EmployeesBranchesEdit', item.id)} />
                      </button>
                      <button className={styles.btn}>
                        <Image src={edit} alt="edit" onClick={() => handleParticipantPage('EmployeesEdit', item.id)} />
                      </button>
                      <button className={styles.btn}>
                        <Image src={deletePng} alt="delete" onClick={() => hanldeDelete(item.id)} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employees;

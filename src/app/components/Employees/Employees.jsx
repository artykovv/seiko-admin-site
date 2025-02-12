import React, { useEffect, useState } from 'react';
import styles from './Employees.module.css';

import edit from '@/assets/edit.svg';
import add from '@/assets/add.webp';
import usersetting from '@/assets/usersetting.svg';
import geo from '@/assets/geo.svg';
import deletePng from '@/assets/delete.svg';

import Image from 'next/image';
import axios from 'axios';
import { API } from '@/constants/constants';

function Employees({ setActiveComponent }) {
  const [users, setUsers] = useState([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getEmployees = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
    }
  };

  const handleOpenDetail = () => {
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`${API}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Успешно удалено!')
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      handleOpenDetail();
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const handleParticipantPage = (name, id) => {
    setActiveComponent({ name, id });
  };

  return (
    <div className={styles.employeesContainer}>
      <div className={styles.tableSection}>
        <div className={styles.tableIn}>
          {isDetailOpen && (
            <div className={styles.detailModal} onClick={handleCloseDetail}>
              <div className={styles.detailModalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.detailModalHeader}>
                  <h2 style={{ color: 'red' }}>Ошибка</h2>
                </div>
                <div className={styles.detailModalBody}>
                  <p>У сотрудника есть <strong>Филиалы</strong></p>
                  <p>У сотрудника есть <strong>Права</strong></p>
                  <p>У сотрудника <strong>Суперпользователь</strong></p>
                  <p>Посмотрите выше перечисленные вещи и убедитесь что все пункты сделаны</p>
                </div>
                <div className={styles.detailModalFooter}>
                  <button className={styles.closeDetailBtn} onClick={handleCloseDetail}>
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          )}
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
                {users && users.length > 0 ? (
                  users.map((item, index) => (
                    <tr key={index}>
                      <td scope="row">{item.lastname} {item.userName} {item.patronymic}</td>
                      <td>{item.email}</td>
                      <td>{item.branch}</td>
                      <td style={{ width: '30%' }}>{item.branches.map(branch => branch.name).join(', ')}</td>
                      <td>{item.is_active ? 'Действует' : 'Не действует'}</td>
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
                          <Image src={deletePng} alt="delete" onClick={() => handleDelete(item.id)} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>Нет данных</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employees;

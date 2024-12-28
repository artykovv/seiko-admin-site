import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/api/api';

import styles from './Branches.module.css';

import Image from 'next/image';
import add from '@/assets/add.webp';
import edit from '@/assets/edit.svg';

function Branches({ setActiveComponent }) {
  const [branches, setBranches] = useState([]);

  const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  };

  const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, val] = cookie.split('=').map((item) => item.trim());
      if (key === name) {
        return decodeURIComponent(val);
      }
    }
    return null;
  };

  const getBranches = async () => {
    const cachedBranches = getCookie('branches');
    if (cachedBranches) {
      setBranches(JSON.parse(cachedBranches));
      return;
    }

    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${API_URL}/api/v1/branches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const branchesData = response.data;
      setBranches(branchesData);
      setCookie('branches', JSON.stringify(branchesData), 7); // Кэшируем на 7 дней
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  useEffect(() => {
    getBranches();
  }, []);

  const handleBranchesPage = (name, id) => {
    setActiveComponent({ name, id });
  };

  return (
    <div className={styles.branchesContainer}>
      <div className={styles.tableSection}>
        <div className={styles.tableIn}>
          <div className={styles.tableWrapper}>
            <div className={styles.btnsWrapper}>
              <button className={styles.addBtn} onClick={() => handleBranchesPage('BranchesAdd', null)}>
                <Image src={add} alt="add" />
                Добавить
              </button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Код</th>
                  <th scope="col">Город</th>
                  <th scope="col" style={{ textAlign: 'center' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((item, index) => (
                  <tr key={index}>
                    <td scope="row">{item.code}</td>
                    <td>{item.name}</td>
                    <td className={styles.editBtn} style={{ justifyContent: 'center' }}>
                      <button
                        className={styles.btn}
                        onClick={() => handleBranchesPage('BranchesEdit', item.id)}
                      >
                        <Image src={edit} alt="edit" />
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

export default Branches;

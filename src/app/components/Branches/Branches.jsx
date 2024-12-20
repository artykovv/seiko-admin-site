import React, { useEffect } from 'react';
import styles from './Branches.module.css';

import edit from '@/assets/edit.svg';
import add from '@/assets/add.webp';

import Image from 'next/image';
import axios from 'axios';
import { API_URL } from '@/api/api';

function Branches({ setActiveComponent }) {

  const getBranches = async () => {
    const token = localStorage.getItem('authToken')
    try {
      const response = await axios.get(`${API_URL}/api/v1/branches`,)
    } catch (error) {

    }
  }

  useEffect(() => {
    getBranches()
  }, [])

  const handleBranchesPage = (name, id) => {
    setActiveComponent({ name, id });
  };
  return (
    <div className={styles.branchesContainer}>
      <div className={styles.tableSection}>
        <div className={styles.tableIn}>
          <div className={styles.tableWrapper}>
            <div className={styles.btnsWrapper}>
              <button className={styles.addBtn}>
                <Image src={add} alt="add" />
                Добавить
              </button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Код</th>
                  <th scope="col">Город</th>
                  <th scope="col">Доступ в регистрации</th>
                  <th scope="col">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="row">S01</td>
                  <td>Бишкек</td>
                  <td>нет</td>
                  <td className={styles.editBtn}>
                    <button className={styles.btn} onClick={() => handleBranchesPage('AddBranches', item.id)}>
                      <Image src={edit} alt="edit" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Branches;

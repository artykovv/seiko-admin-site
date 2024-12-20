import React, { useEffect, useState } from 'react';

import styles from './Branches.module.css';

import Image from 'next/image';

import edit from '@/assets/edit.svg';
import add from '@/assets/add.webp';

import axios from 'axios';
import { API_URL } from '@/api/api';

function Branches({ setActiveComponent }) {
  const [branches, setBranches] = useState([]);

  const getBranches = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${API_URL}/api/v1/branches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const branchesData = response.data;
      setBranches(branchesData);
      localStorage.setItem('branches', JSON.stringify(branchesData));
    } catch (error) {
    }
  };

  useEffect(() => {
    const savedBranches = localStorage.getItem('branches');
    setBranches(JSON.parse(savedBranches));
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

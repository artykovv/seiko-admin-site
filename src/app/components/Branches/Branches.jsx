import React from 'react';
import styles from './Branches.module.css';

import edit from './assets/edit.svg';
import Link from 'next/link';
import add from './assets/add.svg';

import Image from 'next/image';
function Branches() {
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
                    <Link href="#" className={styles.editLink}>
                      <Image src={edit} alt="edit" />
                    </Link>
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

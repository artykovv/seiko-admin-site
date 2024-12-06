import React from 'react';
import styles from './Employees.module.css';

import edit from './assets/edit.svg';
import add from './assets/add.svg';

import Link from 'next/link';
import Image from 'next/image';

function Employees() {
  return (
    <div className={styles.employeesContainer}>
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
                  <th scope="col">ФИО</th>
                  <th scope="col">Город</th>
                  <th scope="col">Доступ в филиалы</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="row"> Иван Иванов Иванов</td>
                  <td>Бишкек</td>
                  <td>Бишкек</td>
                  <td>есть</td>
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

export default Employees;

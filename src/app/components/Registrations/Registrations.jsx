'use client';
import { useState } from 'react';
import styles from './Registrations.module.css';
import arrowFilter from './assets/down-arrow-svgrepo-com.svg';
import Image from 'next/image';
import add from './assets/add.svg';
import Register from './components/Register';


function Registrations() {
  const [isRegisterVisible, setIsRegisterVisible] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Фильтр');

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setIsFilterOpen(false);
  };

  return (
    <div className={styles.registrationsContainer}>
      {isRegisterVisible ? <Register setIsRegisterVisible={setIsRegisterVisible} /> :
        <div className={styles.tableSection}>
          <div className={styles.tableIn}>
            <div className={styles.tableWrapper}>
              <div className={styles.search}>
                <input className={styles.searchInput} type="text" placeholder="Поиск" />
                <div className={styles.btnsWrapper}>
                  <button className={styles.filterBtn} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                    {selectedOption}
                    <Image src={arrowFilter} alt="arrow-filter" style={{ transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </button>
                  <div className={styles.filterMenu} style={{ display: isFilterOpen ? 'flex' : 'none' }}>
                    <button className={styles.selectFilter} onClick={() => handleSelectChange('Все')}>Все</button>
                    <button className={styles.selectFilter} onClick={() => handleSelectChange('START')}>START</button>
                    <button className={styles.selectFilter} onClick={() => handleSelectChange('PARTNER')}>PARTNER</button>
                    <button className={styles.selectFilter} onClick={() => handleSelectChange('BUSINESS')}>BUSINESS</button>
                    <button className={styles.selectFilter} onClick={() => handleSelectChange('ELITE')}>ELITE</button>
                    <button className={styles.selectFilter} onClick={() => handleSelectChange('PREMIUM')}>PREMIUM</button>
                  </div>
                  <button className={styles.addBtn} onClick={() => setIsRegisterVisible(!isRegisterVisible)}>
                    <Image src={add} alt="add" />
                    Добавить
                  </button>
                </div>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Филиал</th>
                    <th scope="col">Персональный N</th>
                    <th scope="col">ФИО</th>
                    <th scope="col">Пакет</th>
                    <th scope="col">Дата регистрации</th>
                    <th scope="col">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td scope="row">Бишкек</td>
                    <td>S0100000</td>
                    <td>Seiko Global Company</td>
                    <td>START</td>
                    <td>Не указано</td>
                    <td>Договор</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default Registrations;

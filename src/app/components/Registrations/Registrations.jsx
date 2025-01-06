'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import styles from './Registrations.module.css';
import Image from 'next/image';
import { API_URL } from '@/api/api';
import axios from 'axios';

import deletePng from "@/assets/delete.svg";
import add from '@/assets/add.webp';
import invite from '@/assets/invite.svg';
import bonus from '@/assets/currency.svg';
import edit from '@/assets/edit.svg';
import arrowFilter from '@/assets/arrowdown.webp';
import agreement from '@/assets/agreement.svg';

function Registrations({ setActiveComponent }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Фильтр');
  const [participants, setParticipants] = useState([]);
  const [pageCount, setPageCount] = useState(20)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const searchInputRef = useRef('');


  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setIsFilterOpen(false);
    setCurrentPage(1);
    getRegistrations(option);
  };

  const handleSearchChange = (event) => {
    searchInputRef.current = event.target.value;
    if (searchInputRef.current == '') {
      getRegistrations(selectedOption)
    } else if (searchInputRef.current.length > 0) {
      setCurrentPage(1);
      getRegistrations(searchInputRef);
    }
  };


  const getRegistrations = useCallback(async (option) => {
    const token = localStorage.getItem('authToken');
    const url = option === 'Все' || option === 'Фильтр'
      ? `${API_URL}/api/v1/participants/none/structure?page=${currentPage}&page_size=${pageCount}`
      : `${API_URL}/api/v1/participants/none/structure?page=${currentPage}&page_size=${pageCount}&paket_names=${option}`;

    const searchUrl = `${API_URL}/api/v1/search/none/participants?query=${searchInputRef.current}&page=${currentPage}&page_size=${pageCount}`;
    if (searchInputRef.current) {
      const response = await axios.get(searchUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setParticipants(response.data.participants || []);
      setTotalPages(response.data.total_pages);
    } else {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setParticipants(response.data.participants || []);
      setTotalPages(response.data.total_pages);
      localStorage.setItem('registrations', JSON.stringify(response.data || []));
    }
  }, []);


  const [participantDetail, setParticipantDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpenDetail = async (personalNumber) => {
    const token = localStorage.getItem('authToken')
    const cachedDetail = localStorage.getItem(`participantInvite_${personalNumber}`);
    if (cachedDetail) {
      setParticipantDetail(JSON.parse(cachedDetail));
      setIsDetailOpen(true);
      return;
    }

    const response = await axios.get(`${API_URL}/api/v1/participants/${personalNumber}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    localStorage.setItem(`participantInvite_${personalNumber}`, JSON.stringify(response.data));
    setParticipantDetail(response.data);
    setIsDetailOpen(true);
  }

  const handleParticipantPage = (name, id) => {
    setActiveComponent({ name, id });
  };

  useEffect(() => {
    getRegistrations(selectedOption);
  }, [selectedOption]);


  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken')
    try {
      await axios.delete(`${API_URL}/api/v1/participants/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      getRegistrations();
    } catch (error) {
    }
  }

  return (
    <div className={styles.registrationsContainer}>
      <div className={styles.tableSection}>
        <div className={styles.tableIn}>
          {isDetailOpen && <div className={styles.detailModal} onClick={() => setIsDetailOpen(false)}>
            <div className={styles.detailModalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.detailModalHeader}>
                <h2>Детали участника</h2>
              </div>
              <div className={styles.detailModalBody}>
                <p> <strong>Персональный номер</strong>: {participantDetail.personal_number}</p>
                <p> {participantDetail.name} {participantDetail.lastname} {participantDetail.patronymic}</p>
                <p> <strong>Пакет</strong>: {participantDetail.paket.name} (${participantDetail.paket.price})</p>
                <p> <strong>Спонсор</strong>: {participantDetail.sponsor ? participantDetail.sponsor.name : 'Не указано'} {participantDetail.sponsor ? participantDetail.sponsor.lastname : 'не указано'}</p>
                <p> <strong>Наставник</strong>: {participantDetail.mentor ? participantDetail.mentor.name : 'Не указано'} {participantDetail.mentor ? participantDetail.mentor.lastname : 'не указано'}</p>
                <p> <strong>Логин</strong>: {participantDetail.email}</p>
                <p> <strong>Личная информация</strong>: {participantDetail.personal_info}</p>
                <p> <strong>Дата рождения</strong>: {participantDetail.birth_date ? new Date(participantDetail.birth_date).toLocaleDateString() : 'Не указано'}</p>
                <p> <strong>Телефон</strong>: {participantDetail.phone_number}</p>
                <p> <strong>Филиал</strong>: {participantDetail.branch.name}</p>
                <p> <strong>Банк. Номер (Мбанк)</strong>: {participantDetail.bank}</p>
                <p> <strong>Левый ТО</strong>: {participantDetail.left_volume}</p>
                <p> <strong>Парвый ТО</strong>: {participantDetail.right_volume}</p>
              </div>
              <div className={styles.detailModalFooter}>
                <button className={styles.closeDetailBtn} onClick={() => setIsDetailOpen(false)}>Закрыть</button>
              </div>
            </div>
          </div>}
          <div className={styles.tableWrapper}>
            <div className={styles.search}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Поиск"
                defaultValue={searchInputRef.current}
                onChange={handleSearchChange}
              />
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
                <button className={styles.addBtn} onClick={() => handleParticipantPage('registerStructure', null)}>
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
                {participants.map((item, index) => (
                  <tr key={index}>
                    <td scope="row">{item.branch.name}</td>
                    <td><button className={styles.openDetailBtn} onClick={() => handleOpenDetail(item.id)}>{item.personal_number}</button></td>
                    <td>{item.name} {item.patronymic} {item.lastname}</td>
                    <td>{item.paket.name}</td>
                    <td>{item.register_at ? new Date(item.register_at).toLocaleDateString() : 'Не указано'}</td>
                    <td className={styles.actions}>
                      <button onClick={() => handleOpenDetail(item.id)} className={styles.btn}>
                        <Image src={agreement} alt='agreement' />
                      </button>
                      <button className={styles.btn} onClick={() => handleParticipantPage('participantStructureAdd', item.sponsor_id)}>
                        <Image src={add} alt="add" />
                      </button>
                      <button className={styles.btn} onClick={() => handleParticipantPage('RegistrationsInvite', item.id)}>
                        <Image src={invite} alt="invite" />
                      </button>
                      <button className={styles.btn} onClick={() => handleParticipantPage('RegistrationsBonuses', item.id)}>
                        <Image src={bonus} alt="bonus" />
                      </button>
                      <button className={styles.btn} onClick={() => handleParticipantPage('RegistrationsEdit', item.id)}>
                        <Image src={edit} alt="edit" />
                      </button>
                      <button className={styles.btn} onClick={() => handleDelete(item.id)}>
                        <Image src={deletePng} alt="delete" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index} onClick={() => handlePageChange(index + 1)} disabled={currentPage === index + 1}>
                {index + 1}
              </button>
            ))}
            <div className={styles.selectPage}>
              <select>
                <option style={pageCount === 20 ? { backgroundColor: '#007BFF' } : {}} onClick={() => setPageCount(20)}>
                  20
                </option>
                <option style={pageCount === 50 ? { backgroundColor: '#007BFF' } : {}} onClick={() => setPageCount(50)}>
                  50
                </option>
                <option style={pageCount === 100 ? { backgroundColor: '#007BFF' } : {}} onClick={() => setPageCount(100)}>
                  100
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registrations;

'use client';
import { useEffect, useState, useCallback } from 'react';
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setIsFilterOpen(false);
  };


  const getParticipants = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_URL}/api/v1/participants/none/structure?page=${page}&page_size=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    setParticipants(response.data.participants || []);
  }, [page, pageSize]);


  const [participantDetail, setParticipantDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpenDetail = async (personalNumber) => {
    const token = localStorage.getItem('authToken')
    const cachedDetail = localStorage.getItem(`participant_${personalNumber}`);
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
    localStorage.setItem(`participant_${personalNumber}`, JSON.stringify(response.data));
    setParticipantDetail(response.data);
    setIsDetailOpen(true);
  }

  const handleParticipantPage = (name, id) => {
    setActiveComponent({ name, id });
  };

  useEffect(() => {
    getParticipants();
  }, [getParticipants]);


  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken')
    try {
      await axios.delete(`${API_URL}/api/v1/participants/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      getParticipants();
    } catch (error) {
      console.log(error);
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
                <p> <strong>Персональный номер:</strong> {participantDetail.personal_number}</p>
                <p> {participantDetail.name} {participantDetail.lastname} {participantDetail.patronymic}</p>
                <p> <strong>Пакет:</strong> {participantDetail.paket.name} (${participantDetail.paket.price})</p>
                <p> <strong>Спонсор:</strong> {participantDetail.sponsor ? participantDetail.sponsor.name : 'Не указано'}</p>
                <p> <strong>Наставник:</strong> {participantDetail.mentor ? participantDetail.mentor.name : 'Не указано'}</p>
                <p> <strong>Логин:</strong> {participantDetail.email}</p>
                <p> <strong>Личная информация:</strong>{participantDetail.personal_info}</p>
                <p> <strong>Дата рождения:</strong> {participantDetail.birth_date ? new Date(participantDetail.birth_date).toLocaleDateString() : 'Не указано'}</p>
                <p> <strong>Телефон:</strong> {participantDetail.phone_number}</p>
                <p> <strong>Филиал:</strong> {participantDetail.branch.name}</p>
                <p> <strong>Банк. Номер (Мбанк):</strong> {participantDetail.bank}</p>
              </div>
              <div className={styles.detailModalFooter}>
                <button className={styles.closeDetailBtn} onClick={() => setIsDetailOpen(false)}>Закрыть</button>
              </div>
            </div>
          </div>}
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
        </div>
      </div>
    </div >
  );
}

export default Registrations;

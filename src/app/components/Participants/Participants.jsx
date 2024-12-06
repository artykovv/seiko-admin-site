'use client';
import { useEffect, useState } from 'react';
import styles from './Participants.module.css';

import arrowFilter from './assets/down-arrow-svgrepo-com.svg';
import invite from './assets/invite.svg';
import bonus from './assets/bonus.svg';
import structure from './assets/structure.svg';
import edit from './assets/edit.svg';

import Image from 'next/image';
import axios from 'axios';
import { API_URL } from '@/api/api';



function Participants({ setActiveComponent }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Фильтр');

  const token = localStorage.getItem('authToken');

  const [participants, setParticipants] = useState(() => {
    const cachedParticipants = localStorage.getItem('participants');
    return cachedParticipants ? JSON.parse(cachedParticipants) : [];
  });

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setIsFilterOpen(false);
  };

  const getParticipants = async () => {

    const response = await axios.get(`${API_URL}/api/v1/participants/in/structure?page=1&page_size=20`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    setParticipants(response.data.participants || []);
    localStorage.setItem('participants', JSON.stringify(response.data || []));
  }
  useEffect(() => {
    getParticipants();
  }, []);

  const [participantDetail, setParticipantDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpenDetail = async (personalNumber) => {
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

  const handleEditParticipant = (name, id) => {
    setActiveComponent({ name, id });
  };

  return (
    <div className={styles.participantsContainer}>
      <div className={styles.tableSection}>
        <div className={styles.tableIn}>

          {/* Детали участника */}
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
                <p> <strong>Логин:</strong> {participantDetail.login}</p>
                <p> <strong>Личная информация:</strong></p>
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
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Филиал</th>
                  <th scope="col">Персональный N</th>
                  <th scope="col">ФИО</th>
                  <th scope="col">Пакет</th>
                  <th scope="col">В бинаре с</th>
                  <th scope="col">Действия</th>
                </tr>
              </thead>
              <tbody>
                {participants.length > 0 && participants.map((item) => (
                  <tr key={item.id}>
                    <td scope="row">{item.branch.name}</td>
                    <td>
                      <button className={styles.openDetailBtn} onClick={() => handleOpenDetail(item.id)}>{item.personal_number}</button>

                    </td>
                    <td>{item.name} {item.lastname} {item.patronymic}</td>
                    <td>{item.paket.name}</td>
                    <td>{item.register_at ? new Date(item.register_at).toLocaleDateString() : 'Не указано'}</td>
                    <td className={styles.actions}>
                      <button onClick={() => handleOpenDetail(item.id)} className={styles.openDetailBtn}>Договор</button>
                      <button className={styles.btn}>
                        <Image src={invite} alt="invite" />
                      </button>
                      <button className={styles.btn}>
                        <Image src={bonus} alt="bonus" />
                      </button>
                      <button className={styles.btn}>
                        <Image src={structure} alt="structure" />
                      </button>
                      <button className={styles.btn} onClick={() => handleEditParticipant('participantEdit', item.id)}>
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

export default Participants;

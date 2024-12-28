'use client';
import { useEffect, useState, useRef } from 'react';
import styles from './Participants.module.css';

import arrowFilter from '@/assets/arrowdown.webp';
import invite from '@/assets/invite.svg';
import bonus from '@/assets/currency.svg';
import structure from '@/assets/structure.svg';
import edit from '@/assets/edit.svg';
import agreement from '@/assets/agreement.svg';

import Image from 'next/image';
import axios from 'axios';
import { API_URL } from '@/api/api';

import toast, { Toaster } from 'react-hot-toast';

// Функция для записи куки
const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Функция для чтения куки
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

// Функция для удаления куки
const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

function Participants({ setActiveComponent }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Фильтр');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const searchInputRef = useRef('');
  const [participants, setParticipants] = useState([]);
  const [pageCount, setPageCount] = useState(20);

  useEffect(() => {
    const cachedParticipants = getCookie('participants');
    if (cachedParticipants) {
      setParticipants(JSON.parse(cachedParticipants));
    } else {
      setParticipants([]);
    }
  }, []);

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setIsFilterOpen(false);
    setCurrentPage(1);
    getParticipants(option);
  };

  const handleParticipantPage = (name, id) => {
    setActiveComponent({ name, id });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getParticipants();
  };

  const handleSearchChange = (event) => {
    searchInputRef.current = event.target.value;
    if (searchInputRef.current === '') {
      getParticipants(selectedOption);
    } else if (searchInputRef.current.length > 0) {
      setCurrentPage(1);
      getParticipants(searchInputRef);
    }
  };

  const getParticipants = async (option) => {
    const token = localStorage.getItem('authToken'); // Чтение токена из куки
    const url = option === 'Все' || option === 'Фильтр'
      ? `${API_URL}/api/v1/participants/in/structure?page=${currentPage}&page_size=${pageCount}`
      : `${API_URL}/api/v1/participants/in/structure?page=${currentPage}&page_size=${pageCount}&paket_names=${option}`;

    const searchUrl = `${API_URL}/api/v1/search/participants?query=${searchInputRef.current}&page=${currentPage}&page_size=${pageCount}`;
    if (searchInputRef.current) {
      const response = await axios.get(searchUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setParticipants(response.data.participants || []);
      setTotalPages(response.data.total_pages);
    } else {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setParticipants(response.data.participants || []);
      setTotalPages(response.data.total_pages);
      setCookie('participants', JSON.stringify(response.data)); // Сохраняем данные в куки
    }
  };

  useEffect(() => {
    getParticipants(selectedOption);
  }, [selectedOption]);

  //! Модальное окно
  const [participantDetail, setParticipantDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpenDetail = async (personalNumber) => {
    const token = localStorage.getItem('authToken'); // Чтение токена из куки
    const cachedDetail = getCookie(`participant_${personalNumber}`); // Загружаем данные из куки

    let toastId;
    if (!cachedDetail) {
      toastId = toast.loading('Загрузка...', {
        duration: 1500,
        position: 'bottom-left',
      });
    } else if (toastId) {
      toast.dismiss(toastId);
    }

    if (cachedDetail) {
      setParticipantDetail(JSON.parse(cachedDetail)); // Загружаем данные из куки
      setIsDetailOpen(true);
      return;
    }

    const response = await axios.get(`${API_URL}/api/v1/participants/${personalNumber}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    setCookie(`participant_${personalNumber}`, JSON.stringify(response.data)); // Сохраняем данные в куки
    setParticipantDetail(response.data);
    setIsDetailOpen(true);
  };
  //! Модальное окно


  return (
    <div className={styles.participantsContainer}>
      <div className={styles.tableSection}>
        <div className={styles.tableIn}>
          <Toaster />

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
                <p> <strong>Личная информация:</strong> {participantDetail.personal_info}</p>
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
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Поиск"
                defaultValue={searchInputRef.current}
                onChange={handleSearchChange}
              />
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
                      <button onClick={() => handleOpenDetail(item.id)} className={styles.btn}>
                        <Image src={agreement} alt='agreement' />
                      </button>
                      <button className={styles.btn} onClick={() => handleParticipantPage('ParticipantInvite', item.id)}>
                        <Image src={invite} alt="invite" />
                      </button>
                      <button className={styles.btn} onClick={() => handleParticipantPage('participantBonuses', item.id)}>
                        <Image src={bonus} alt="bonus" />
                      </button>
                      <button className={styles.btn} onClick={() => handleParticipantPage('participantStructure', item.id)}>
                        <Image src={structure} alt="structure" />
                      </button>
                      <button className={styles.btn} onClick={() => handleParticipantPage('participantEdit', item.id)}>
                        <Image src={edit} alt="edit" />
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

export default Participants;

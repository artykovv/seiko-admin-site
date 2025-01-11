'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './Participants.module.css';

import arrowFilter from '@/assets/arrowdown.webp';
import invite from '@/assets/invite.svg';
import bonus from '@/assets/currency.svg';
import structure from '@/assets/structure.svg';
import edit from '@/assets/edit.svg';
import agreement from '@/assets/agreement.svg';

import Image from 'next/image';
import axios from 'axios';
import { API } from '@/constants/constants';

function Participants({ setActiveComponent }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Фильтр');
  const [participants, setParticipants] = useState([]);
  const pageCountRef = useRef(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const searchInputRef = useRef('');

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setIsFilterOpen(false);
    setCurrentPage(1);
    getParticipants(option);
  };

  const handleParticipantPage = (name, id) => {
    setActiveComponent({ name, id });
  };

  const handlePageCountChange = (event) => {
    pageCountRef.current = Number(event.target.value);
    setCurrentPage(1);
    getParticipants(selectedOption);
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

  const getParticipants = useCallback(async (option) => {
    const token = localStorage.getItem('authToken');
    try {
      const url = option === 'Все' || option === 'Фильтр'
        ? `${API}/api/v1/participants/in/structure?page=${currentPage}&page_size=${pageCountRef.current}`
        : `${API}/api/v1/participants/in/structure?page=${currentPage}&page_size=${pageCountRef.current}&paket_names=${option}`;

      const searchUrl = `${API}/api/v1/search/participants?query=${searchInputRef.current}&page=${currentPage}&page_size=${pageCountRef.current}`;

      const response = searchInputRef.current
        ? await axios.get(searchUrl, { headers: { Authorization: `Bearer ${token}` } })
        : await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });

      setParticipants(response.data.participants || []);
      setTotalPages(response.data.total_pages);

    } catch (error) {
    }
  }, [currentPage]);

  useEffect(() => {
    getParticipants(selectedOption);
  }, [selectedOption, currentPage]);

  //! Модальное окно
  const [participantDetail, setParticipantDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpenDetail = async (personalNumber) => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API}/api/v1/participants/${personalNumber}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    setParticipantDetail(response.data);
    setIsDetailOpen(true);
  };
  //! Модальное окно

  return (
    <div className={styles.participantsContainer}>
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
            <div className={styles.paginate}>
              {(() => {
                const pages = [];
                const isStart = currentPage <= 4;
                const isEnd = currentPage >= totalPages - 3;

                pages.push(
                  <button
                    key="page_1"
                    onClick={() => setCurrentPage(1)}
                    className={currentPage === 1 ? styles.activePage : ''}
                  >
                    1
                  </button>
                );

                if (!isStart) {
                  pages.push(<span key="start_ellipsis">...</span>);
                }

                const startPage = isStart ? 2 : isEnd ? totalPages - 5 : currentPage - 2;
                const endPage = isEnd ? totalPages - 1 : isStart ? 6 : currentPage + 2;

                for (let page = startPage; page <= endPage; page++) {
                  pages.push(
                    <button
                      key={`page_${page}`}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? styles.activePage : ''}
                    >
                      {page}
                    </button>
                  );
                }

                if (!isEnd) {
                  pages.push(<span key="end_ellipsis">...</span>);
                }

                if (totalPages > 1) {
                  pages.push(
                    <button
                      key={`page_${totalPages}`}
                      onClick={() => setCurrentPage(totalPages)}
                      className={currentPage === totalPages ? styles.activePage : ''}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}
            </div>
            <div className={styles.selectPage}>
              <select defaultValue={pageCountRef.current} onChange={handlePageCountChange}>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Participants;

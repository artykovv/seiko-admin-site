'use client';
import React, { useState } from 'react';
import SurpriseBonus from './components/SurpriseBonus';
import AutoProgram from './components/AutoProgram';
import TouristBonus from './components/TouristBonus';

import styles from './Gifts.module.css';

function Gifts() {
  const [activeComponent, setActiveComponent] = useState('SurpriseBonus');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'SurpriseBonus':
        return <SurpriseBonus />;
      case 'AutoProgram':
        return <AutoProgram />;
      case 'TouristBonus':
        return <TouristBonus />;
      default:
        return 'SurpriseBonus';
    }
  };

  return (
    <div className={styles.giftsContainer}>
      <div className={styles.tableSection}>
        <div className={styles.tableIn}>
          <div className={styles.tableWrapper}>
            <div className={styles.btnsWrapper}>
              <button
                className={activeComponent === 'SurpriseBonus' ? styles.activeButton : ''}
                onClick={() => setActiveComponent('SurpriseBonus')}
              >
                Сюрприз бонус
              </button>
              <button
                className={activeComponent === 'TouristBonus' ? styles.activeButton : ''}
                onClick={() => setActiveComponent('TouristBonus')}
              >
                Туристический бонус
              </button>
              <button
                className={activeComponent === 'AutoProgram' ? styles.activeButton : ''}
                onClick={() => setActiveComponent('AutoProgram')}
              >
                Автопрограмма
              </button>
            </div>
            {renderComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gifts;

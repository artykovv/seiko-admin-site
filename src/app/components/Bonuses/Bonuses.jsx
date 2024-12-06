'use client';
import React, { useState } from 'react';
import styles from './Bonuses.module.css';
import BinaryCheck from './components/BinaryCheck';
import ReferralBonuses from './components/ReferralBonuses';
import StatusAndSponsorship from './components/StatusAndSponsorship';



function Bonuses() {
  const [activeComponent, setActiveComponent] = useState('BinaryCheck');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'BinaryCheck':
        return <BinaryCheck />;
      case 'ReferralBonuses':
        return <ReferralBonuses />;
      case 'StatusAndSponsorship':
        return <StatusAndSponsorship />;
      default:
        return 'BinaryCheck';
    }
  };

  return (
    <div className={styles.bonusesContainer}>
      <div className={styles.tableSection}>
        <div className={styles.tableIn}>
          <div className={styles.tableWrapper}>
            <div className={styles.btnsWrapper}>
              <button
                className={activeComponent === 'BinaryCheck' ? styles.activeButton : ''}
                onClick={() => setActiveComponent('BinaryCheck')}
              >
                Бинар и чек от чека
              </button>
              <button
                className={activeComponent === 'ReferralBonuses' ? styles.activeButton : ''}
                onClick={() => setActiveComponent('ReferralBonuses')}
              >
                Реферальные бонусы
              </button>
              <button
                className={activeComponent === 'StatusAndSponsorship' ? styles.activeButton : ''}
                onClick={() => setActiveComponent('StatusAndSponsorship')}
              >
                Статусные и спонсорские
              </button>
            </div>
            {renderComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bonuses;

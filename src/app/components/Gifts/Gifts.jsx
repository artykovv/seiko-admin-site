'use client';
import React, { useState } from 'react';
import SurpriseBonus from './components/SurpriseBonus';
import AutoProgram from './components/AutoProgram';
import TouristBonus from './components/TouristBonus';
import SurpriseBonusAdd from './components/SurpriseBonusAdd';
import { motion, AnimatePresence } from 'framer-motion';

import styles from './Gifts.module.css';

function Gifts() {
  const [activeComponent, setActiveComponentGift] = useState('SurpriseBonus');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'SurpriseBonus':
        return <SurpriseBonus setActiveComponentGift={setActiveComponentGift} />;
      case 'AutoProgram':
        return <AutoProgram />;
      case 'TouristBonus':
        return <TouristBonus />;
      case 'SurpriseBonusAdd':
        return <SurpriseBonusAdd setActiveComponentGift={setActiveComponentGift} />;
      default:
        return <SurpriseBonus setActiveComponentGift={setActiveComponentGift} />;
    }
  };


  return (
    <div className={styles.giftsContainer}>
      <div className={styles.tableSection}>
        <div className={styles.tableIn}>
          {activeComponent === 'SurpriseBonusAdd' ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeComponent.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {renderComponent()}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className={styles.tableWrapper}>
              <div className={styles.btnsWrapper}>
                <button
                  className={activeComponent === 'SurpriseBonus' ? styles.activeButton : ''}
                  onClick={() => setActiveComponentGift('SurpriseBonus')}
                >
                  Сюрприз бонус
                </button>
                <button
                  className={activeComponent === 'TouristBonus' ? styles.activeButton : ''}
                  onClick={() => setActiveComponentGift('TouristBonus')}
                >
                  Туристический бонус
                </button>
                <button
                  className={activeComponent === 'AutoProgram' ? styles.activeButton : ''}
                  onClick={() => setActiveComponentGift('AutoProgram')}
                >
                  Автопрограмма
                </button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeComponent.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderComponent()}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Gifts;

import React from 'react'
import styles from "../Employees.module.css";

export default function EmployeesBranchesEdit({ participantId, setActiveComponent }) {

    const handleBack = (name, id) => {
        setActiveComponent({ name, id });
    };

    return (
        <div className={styles.detailModal} onClick={() => handleBack('')}>
            <div className={styles.detailModalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.detailModalHeader}>
                    <h2>Детали участника</h2>
                </div>
                <div className={styles.detailModalBody}>
                </div>
                <div className={styles.detailModalFooter}>
                    <button className={styles.closeDetailBtn} onClick={() => handleBack('')}>Закрыть</button>
                </div>
            </div>
        </div>
    )
}

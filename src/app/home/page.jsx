'use client'
import { useEffect, useState, useCallback } from 'react';
import Home from '../components/Home/Home';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Participants from '../components/Participants/Participants';
import Registrations from '../components/Registrations/Registrations';
import Employees from '../components/Employees/Employees';
import Branches from '../components/Branches/Branches';
import Bonuses from '../components/Bonuses/Bonuses';
import Gifts from '../components/Gifts/Gifts';

import { useRouter } from 'next/navigation'


import { motion, AnimatePresence } from 'framer-motion';

import styles from './page.module.css';
import axios from 'axios';
import { API_URL } from '@/api/api';
import ParticipantEdit from '../components/Participants/components/ParticipantEdit';

function Page() {
    const router = useRouter()
    const token = localStorage.getItem('authToken');

    const [permissions, setPermissions] = useState(() => {
        const savedPermissions = localStorage.getItem('permissions');
        return savedPermissions ? JSON.parse(savedPermissions) : [];
    });

    useEffect(() => {
        if (!token) {
            router.push('/');
        } else {
            router.push('/home');
        }
    }, []);

    const getUser = useCallback(async () => {
        if (permissions.length > 0) {
            return;
        }

        const response = await axios.get(`${API_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const fetchedPermissions = response.data.permissions;
        setPermissions(fetchedPermissions);
        localStorage.setItem('permissions', JSON.stringify(fetchedPermissions));
    }, [token, permissions]);

    useEffect(() => {
        getUser();
    }, [getUser]);

    const [activeComponent, setActiveComponent] = useState({ name: 'home', id: null });
    console.log(activeComponent);

    const renderComponent = () => {
        switch (activeComponent.name) {
            case 'home':
                return <Home />;
            case 'participants':
                return <Participants setActiveComponent={setActiveComponent} />;
            case 'registrations':
                return <Registrations />;
            case 'employees':
                return <Employees />;
            case 'branches':
                return <Branches />;
            case 'bonuses':
                return <Bonuses />;
            case 'gift':
                return <Gifts />;
            case 'participantEdit':
                return <ParticipantEdit participantId={activeComponent.id} />;
            default:
                return <Home />;
        }
    };

    return (
        <div className='container'>
            <div>
                <Header />
                <main className={styles.main}>
                    <div className={styles.sidebar}>
                        {permissions.map((permission) => (
                            <button
                                key={permission.permission_name}
                                onClick={() => setActiveComponent({ name: permission.permission_name, id: null })}
                                className={activeComponent.name === permission.permission_name ? styles.activeButton : ''}
                            >
                                {(() => {
                                    const permissionLabels = {
                                        'home': 'Главная',
                                        'participants': 'Участники',
                                        'registrations': 'Регистрации',
                                        'employees': 'Сотрудники',
                                        'branches': 'Филиалы',
                                        'bonuses': 'Бонусы',
                                        'gift': 'Подарочные',
                                        'participantEdit': 'Редактирование участника'
                                    };
                                    return permissionLabels[permission.permission_name] || permission.permission_name;
                                })()}
                            </button>
                        ))}
                    </div>
                    <div className={styles.content}>
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
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default Page;

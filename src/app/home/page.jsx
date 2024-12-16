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
import ParticipantBonuses from '../components/Participants/components/ParticipantBonuses';
import ParticipantInvite from '../components/Participants/components/ParticipantInvite';
import ParticipantStructure from '../components/Participants/components/ParticipantStructure';
import Register from '../components/Registrations/components/Register';
import AddStructure from '../components/Registrations/components/AddStructure';
import RegistrationsBonuses from '../components/Registrations/components/RegistrationsBonuses';
import RegistrationsInvite from '../components/Registrations/components/RegistrationsInvite';
import RegistrationsEdit from '../components/Registrations/components/RegistrationsEdit';

function Page() {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [activeComponent, setActiveComponent] = useState({ name: 'home', id: null });

    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        const savedPermissions = localStorage.getItem('permissions');

        setToken(savedToken);
        if (savedPermissions) {
            setPermissions(JSON.parse(savedPermissions));
        }
    }, []);

    const getUser = useCallback(async () => {
        if (!token || permissions.length > 0) return;

        try {
            const response = await axios.get(`${API_URL}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const fetchedPermissions = response.data.permissions;
            setPermissions(fetchedPermissions);
            localStorage.setItem('permissions', JSON.stringify(fetchedPermissions));
        } catch (error) {
            console.error('Failed to fetch user permissions:', error);
        }
    }, [token, permissions]);

    useEffect(() => {
        getUser();
    }, [getUser]);


    const renderComponent = () => {
        switch (activeComponent.name) {
            case 'home':
                return <Home />;
            case 'participants':
                return <Participants setActiveComponent={setActiveComponent} />;
            case 'registrations':
                return <Registrations participantId={activeComponent.id} setActiveComponent={setActiveComponent} />;
            case 'employees':
                return <Employees />;
            case 'branches':
                return <Branches />;
            case 'bonuses':
                return <Bonuses />;
            case 'gift':
                return <Gifts />;
            case 'participantEdit':
                return <ParticipantEdit participantId={activeComponent.id} setActiveComponent={setActiveComponent} />;
            case 'ParticipantInvite':
                return <ParticipantInvite participantId={activeComponent.id} setActiveComponent={setActiveComponent} />;
            case 'participantBonuses':
                return <ParticipantBonuses participantId={activeComponent.id} setActiveComponent={setActiveComponent} />;
            case 'participantStructure':
                return <ParticipantStructure participantId={activeComponent.id} setActiveComponent={setActiveComponent} />;
            case 'registerStructure':
                return <Register participantId={activeComponent.id} setActiveComponent={setActiveComponent} />;
            case 'participantStructureAdd':
                return <AddStructure participantId={activeComponent.id} setActiveComponent={setActiveComponent} />;
            case 'RegistrationsInvite':
                return <RegistrationsInvite participantId={activeComponent.id} setActiveComponent={setActiveComponent} />;
            case 'RegistrationsBonuses':
                return <RegistrationsBonuses participantId={activeComponent.id} setActiveComponent={setActiveComponent} />;
            case 'RegistrationsEdit':
                return <RegistrationsEdit participantId={activeComponent.id} setActiveComponent={setActiveComponent} />;
            default:
                return <Home />;
        }
    };

    useEffect(() => {
        const validateToken = async () => {
            try {
                await axios.get(`${API_URL}/auth/validate-token`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                localStorage.removeItem('authToken');
                router.push('/');
            }
        };

        if (!token) {
            router.push('/');
        } else {
            validateToken();
        }
    }, [token, activeComponent, router]);

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

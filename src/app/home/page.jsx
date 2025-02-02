'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import styles from './page.module.css';
import { API } from '@/constants/constants';

import Home from '../components/Home/Home';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Participants from '../components/Participants/Participants';
import Registrations from '../components/Registrations/Registrations';
import Employees from '../components/Employees/Employees';
import Branches from '../components/Branches/Branches';
import Bonuses from '../components/Bonuses/Bonuses';
import Gifts from '../components/Gifts/Gifts';

import ParticipantEdit from '../components/Participants/components/ParticipantEdit';
import ParticipantBonuses from '../components/Participants/components/ParticipantBonuses';
import ParticipantInvite from '../components/Participants/components/ParticipantInvite';
import ParticipantStructure from '../components/Participants/components/ParticipantStructure';
import Register from '../components/Registrations/components/Register';
import AddStructure from '../components/Registrations/components/AddStructure';
import RegistrationsBonuses from '../components/Registrations/components/RegistrationsBonuses';
import RegistrationsInvite from '../components/Registrations/components/RegistrationsInvite';
import RegistrationsEdit from '../components/Registrations/components/RegistrationsEdit';
import BranchesEdit from '../components/Branches/components/BranchesEdit';
import BranchesAdd from '../components/Branches/components/BranchesAdd';
import EmployeesBranchesEdit from '../components/Employees/components/EmployeesBranchesEdit';
import EmployeesPermissionsEdit from '../components/Employees/components/EmployeesPermissionsEdit';
import EmployeesEdit from '../components/Employees/components/EmployeesEdit';
import EmployeesAdd from '../components/Employees/components/EmployeesAdd';
import { Toaster } from 'react-hot-toast';
import Rebate from '../components/Rebate/Rebate';
import RebateAdd from '../components/Rebate/components/RebateAdd';
import SurpriseBonusAdd from '../components/Gifts/components/SurpriseBonusAdd';


function Page() {
    const router = useRouter()
    const [permissions, setPermissions] = useState([]);
    const [activeComponent, setActiveComponent] = useState({ name: 'Главная', id: null, sponsorId: null, paketId: null });
    const [updatedPermissions, setUpdatePermissions] = useState(false)

    useEffect(() => {
        const savedPermissions = localStorage.getItem('permissions');
        if (savedPermissions) {
            setPermissions(JSON.parse(savedPermissions));
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        const validateToken = async () => {
            try {
                await axios.get(`${API}/auth/validate-token`, {
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
            router.push('/home');
        }
    }, [activeComponent, router]);

    const getUser = useCallback(async () => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.get(`${API}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPermissions(response.data.permissions);
            setUpdatePermissions(true)
            localStorage.setItem('permissions', JSON.stringify(response.data.permissions));
        } catch (error) {
            localStorage.removeItem('authToken');
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        getUser();
    }, [updatedPermissions, getUser], permissions);

    const components = {
        'Главная': <Home />,
        'Участники': <Participants setActiveComponent={setActiveComponent} />,
        'Регистрации': <Registrations participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        "Сотрудники": <Employees setActiveComponent={setActiveComponent} />,
        "Филиалы": <Branches participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        "Бонусы": <Bonuses />,
        "Подарочные": <Gifts setActiveComponent={setActiveComponent} />,
        "Cкидка": <Rebate setActiveComponent={setActiveComponent} />,
        'participantEdit': <ParticipantEdit participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        'ParticipantInvite': <ParticipantInvite participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        'participantBonuses': <ParticipantBonuses participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        'participantStructure': <ParticipantStructure participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        'registerStructure': <Register participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        'participantStructureAdd': <AddStructure participantId={activeComponent.id} setActiveComponent={setActiveComponent} sponsorId={activeComponent.sponsorId} paketId={activeComponent.paketId} />,
        'RegistrationsInvite': <RegistrationsInvite participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        'RegistrationsBonuses': <RegistrationsBonuses participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        'RegistrationsEdit': <RegistrationsEdit participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        'BranchesEdit': <BranchesEdit participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        'BranchesAdd': <BranchesAdd participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        'EmployeesBranchesEdit': <EmployeesBranchesEdit participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        'EmployeesEdit': <EmployeesEdit participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        'EmployeesAdd': <EmployeesAdd participantId={activeComponent.id} setActiveComponent={setActiveComponent} />,
        'EmployeesPermissionsEdit': <EmployeesPermissionsEdit participantId={activeComponent.id} setActiveComponent={setActiveComponent} setUpdatePermissions={setUpdatePermissions} />,
        'RebateAdd': <RebateAdd participantId={activeComponent.id} setActiveComponent={setActiveComponent} setUpdatePermissions={setUpdatePermissions} />,
        'SurpriseBonusAdd': <SurpriseBonusAdd setActiveComponent={setActiveComponent} />
    };

    const renderComponent = () => {
        return components[activeComponent.name] || <Home />;
    };

    return (
        <div className='container'>
            <div>
                <Header />
                <main className={styles.main}>
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                    />
                    <div className={styles.sidebar}>
                        {permissions
                            .slice()
                            .sort((a, b) => {
                                if (a.id < b.id) return -1;
                                if (a.id > b.id) return 1;
                                return 0;
                            })
                            .map((permission) => (
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
                                            'rebate': 'Cкидка',
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





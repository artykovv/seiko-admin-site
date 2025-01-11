'use client'
import Image from 'next/image';
import styles from './Header.module.css';

import logo from '@/assets/logo.svg'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import axios from 'axios';

import { API } from '@/constants/constants';

function Header() {
    const [userName, setUserName] = useState('')
    const [lastname, setLastname] = useState('')
    const [patronymic, setPatronymic] = useState('')
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/');
        } else {
            router.push('/home');
        }
    }, []);

    const getUserName = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const { name, lastname, patronymic } = response.data;
            setUserName(name);
            setLastname(lastname);
            setPatronymic(patronymic);

            localStorage.setItem('userName', name);
            localStorage.setItem('lastname', lastname);
            localStorage.setItem('patronymic', patronymic);
        } catch (error) {
        }
    }

    useEffect(() => {
        const cachedName = localStorage.getItem('userName');
        const cachedLastname = localStorage.getItem('lastname');
        const cachedPatronymic = localStorage.getItem('patronymic');

        if (cachedName && cachedLastname && cachedPatronymic) {
            setUserName(cachedName);
            setLastname(cachedLastname);
            setPatronymic(cachedPatronymic);
        } else {
            getUserName();
        }
    }, []);

    return (
        <header className={styles.header}>
            <Image width={130} src={logo} alt='logo' priority />
            <span>{lastname} {userName} {patronymic}</span>
        </header>
    );
}

export default Header;

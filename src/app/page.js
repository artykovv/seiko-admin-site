'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios';

import styles from './page.module.css'
import { API_URL } from '@/api/api';

export default function Page() {
  const router = useRouter()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      router.push('/home');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('username', username);
      params.append('password', password);

      const response = await axios.post(`${API_URL}/auth/jwt/login`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      switch (response.status) {
        case 200:
          setMessage('Успешная аутентификация');
          const token = response.data.access_token;
          localStorage.setItem('authToken', token);
          router.push('/home');
          setUsername('');
          setPassword('');
          setMessage('');
          break;
        case 401:
          setMessage('Неверный логин или пароль');
          break;
        case 403:
          setMessage('Доступ запрещен');
          break;
        case 400:
          setMessage('Пользователь не найден');
          break;
        case 422:
          setMessage('Неверный логин или пароль');
          break;
        default:
          setMessage('Ошибка сети');
          break;
      }
    } catch (error) {
      switch (error.status) {
        case 502:
          setMessage('Сайт временно не работает');
          break;
        default:
          setMessage('Неверный логин или пароль');
          break;
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Авторизация</h1>
        <div className={styles.form_container}>
          <input
            type="email"
            placeholder="Почта"
            value={username}
            autoComplete='username'
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          {message && <p className={styles.message}>{message}</p>}
        </div>
        <button type="submit" className={styles.button}>Войти</button>
      </form>
    </div>
  )
}

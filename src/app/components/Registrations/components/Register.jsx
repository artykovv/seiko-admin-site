import React from 'react'

export default function Register({ setIsRegisterVisible }) {
    return (
        <div>
            <button onClick={() => setIsRegisterVisible(false)}>Закрыть</button>
            <h1>Регистрация</h1>
        </div>
    )
}

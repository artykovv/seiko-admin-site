import React, { useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/api/api';

export default function ParticipantEdit({ participantId }) {
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        if (participantId) {
            handleEditParticipant(participantId);
        }
    }, [participantId]);

    const handleEditParticipant = async (personalNumber) => {
        try {
            const response = await axios.put(`${API_URL}/api/v1/participants/${personalNumber}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);
        } catch (error) {
            console.error('Error editing participant:', error);
        }
    };


    return (
        <div>

            <h2>Редактирование участника {participantId}</h2>
            {/* Здесь можно добавить форму для редактирования */}
        </div>
    );
}


import React, { useEffect, useState } from 'react'
import { Global } from '../helpers/Global';
import { ApiRequests } from '../helpers/ApiRequests';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

export const useProfile = (userid) => {

    const [profile, setProfile] = useState([]);
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = userid || auth.id;
        if (id) {
            getProfile(id);
        } else {
            navigate("/");
        }
    }, [userid, auth.id]);

    const getProfile = async (id) => {
        try {
            /* Peticion para sacar usuarios */
            const { data, status } = await ApiRequests(`${Global.url}${id}/profile`, "GET", undefined, false);
            if (status === 200) {
                setProfile(data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error en la solicitud", error);
        }
    }

    return { profile, loading }
}

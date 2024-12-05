import React, { useEffect, useState } from 'react'
import { Global } from '../helpers/Global';
import { ApiRequests } from '../helpers/ApiRequests';

export const useListUsers = (searchQuery) => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (searchQuery.trim() !== "") {
            getUsers(searchQuery);
        } else {
            setUsers([]); // Vaciar la lista de usuarios cuando no haya query
        }
    }, [searchQuery]);

    const getUsers = async (query) => {
        try {
            /* Peticion para sacar usuarios */
            const { data, status } = await ApiRequests(`${Global.url}users`, "GET", undefined, false);
            if (status === 200) {
                const filteredData = data.filter(user => {
                    // Concatenar name y last_name para buscar en ambos a la vez
                    const fullName = `${user.name} ${user.last_name}`.toLowerCase();

                    const matchesQuery = query ? fullName.includes(query.toLowerCase()) : true;
                    return matchesQuery && !user.roles.includes("ROLE_ADMIN");
                });
                setUsers(filteredData);
            }
        } catch (error) {
            console.error("Error en la solicitud", error);
        }
    }

    return { users }
}

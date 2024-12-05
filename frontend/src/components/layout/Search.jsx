import React, { useState, useEffect } from 'react';
import { Modal } from 'flowbite-react';
import { useListUsers } from '../../hooks/useListUsers';
import { Global } from '../../helpers/Global';
import { NavLink, useLocation } from 'react-router-dom';
import avatar from '../../assets/img/default.png';

export const Search = () => {

    const [openModal, setOpenModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { users } = useListUsers(searchQuery);
    const location = useLocation();

    // Manejar Ctrl+K para abrir el modal
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'k') {
                event.preventDefault();
                setOpenModal(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, []);

    useEffect(() => {
        setOpenModal(false); // Cierra el modal cuando la ubicación cambia
    }, [location]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <>
            {/* Botón de búsqueda */}
            <button type="button" className="flex items-center justify-between py-2 md:py-0 px-2 w-full lg:w-52 transition-colors duration-300 text-gray-900 focus:outline-none bg-gray-200 rounded-lg hover:bg-gray-400 focus:z-10 focus:ring-4 focus:ring-gray-400 dark:focus:ring-gray-800 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-800" aria-label="Search"
                onClick={() => setOpenModal(true)}>
                <span className='flex  w-1/2 md:w-full lg:w-1/2 space-x-2'>
                    <svg width="20" height="20" viewBox="0 0 20 20"> <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"></path> </svg>
                    <span className="md:hidden lg:block">Buscar...</span>
                </span>
                <span className='md:hidden lg:block'>
                    <kbd>Ctrl + </kbd>
                    <kbd>K</kbd>
                </span>
            </button>

            {/* Modal que contiene el campo de búsqueda */}
            <Modal show={openModal} onClose={() => setOpenModal(false)} dismissible={true}>
                <Modal.Header className="p-2">
                    <div className='flex items-center mx-2'>
                        <svg width="20" height="20" viewBox="0 0 20 20">
                            <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" ></path>
                        </svg>
                        <div className="w-full">
                            <input type="text" onChange={handleSearchChange}
                                className="block py-2.5  w-full text-sm text-gray-900 bg-transparent border-0 appearance-none dark:text-white dark:border-gray-600 focus:ring-0"
                                placeholder="Buscar..." />
                        </div>
                    </div>
                </Modal.Header>

                <Modal.Body>
                    {users.length > 0 ? (
                        users.map(user => (
                            <NavLink
                                className="flex items-center h-15 my-1 p-2 transition-colors duration-300 text-gray-900 focus:outline-none bg-white rounded-lg hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-800 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-800"
                                to={`/profiles/home/${user.id}`}
                                key={user.id}
                            >
                                {user.image == 'default.png' && <img className="w-8 h-8 rounded-full mr-3 object-cover" src={avatar} alt="Bordered avatar" />}
                                {user.image != 'default.png' && <img className="w-8 h-8 rounded-full mr-3 object-cover" src={`${Global.url}avatar/${user.image}`} alt="user photo" />}
                                <div>
                                    <h2 className="font-semibold">{user.name} {user.last_name}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.portfolio.position}</p>
                                </div>
                            </NavLink>

                        ))
                    ) : (
                        <p className='text-center'>No users found</p>
                    )}
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
        </>
    );
};

import React from 'react'
import { Footer } from "flowbite-react";
import { NavLink } from 'react-router-dom';

export const FooterEnd = () => {

    const now = new Date();

    return (
        <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm flex flex-col md:flex-row space-x-2 text-gray-500 sm:text-center dark:text-gray-400">
                    <span className='ms-2 md:ms-0'>© {now.getFullYear()}</span>
                    <span>Daulin Polanco Beard</span>
                    <span className='hidden md:block'>-</span>
                    <NavLink to={`/`}>SkillsCulptor</NavLink>
                    <span className='hidden md:block'>-</span>
                    <span>Todos los derechos reservados.</span>
                </span>
            </div>
        </footer>
    )
}

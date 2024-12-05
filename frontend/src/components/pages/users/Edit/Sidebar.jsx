import React, { useEffect, useState } from 'react'
import { ImProfile } from "react-icons/im";
import { IoSchool } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { PiProjectorScreenChartFill } from "react-icons/pi";
import { HiUser } from "react-icons/hi";
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { useClickAway } from '@uidotdev/usehooks';
import { TiThMenu } from "react-icons/ti";
import { IoCloseSharp } from "react-icons/io5";
import { useTheme } from '../../../../hooks/useTheme';

export const Sidebar = () => {

    const { auth } = useAuth();
    const location = useLocation();
    const [openSidebar, setOpenSidebar] = useState(false);
    const { primaryColor } = useTheme();

    const ref = useClickAway(() => {
        setOpenSidebar(false);
    });

    useEffect(() => {
        setOpenSidebar(false);
    }, [location]);

    const handleToggleSidebar = () => {
        setOpenSidebar(!openSidebar);
    };

    return (
        <div className=' md:bg-gray-50 md:dark:bg-gray-800 md:h-full'>
            <button
                type="button"
                className="text-3xl p-3 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-dropdown"
                aria-expanded={openSidebar}
                onClick={handleToggleSidebar}
            >
                {openSidebar ? <IoCloseSharp /> : <TiThMenu />}
            </button>

            <aside ref={ref} id="default-sidebar" aria-label="Sidebar"
                className={`fixed h-full top-0 left-0 z-20 md:z-10 md:relative w-64 transition-transform transform  ${openSidebar ? 'translate-x-0' : ' -translate-x-full'} md:translate-x-0`}
            >
                <div className="h-full px-3 py-4 bg-gray-50 dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink to={`/user/edit/${auth.id}/user`} className={({ isActive }) =>
                                isActive
                                    ? `${primaryColor.text} font-bold flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group`
                                    : 'text-white-100 flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'
                            }>
                                <HiUser className='text-2xl' />
                                <span className="ms-3">Usuario</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`/user/edit/${auth.id}/portfolio`} className={({ isActive }) =>
                                isActive
                                    ? `${primaryColor.text} font-bold flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group`
                                    : 'text-white-100 flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'
                            }>
                                <ImProfile className='text-2xl' />
                                <span className="ms-3">Portfolio</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`/user/edit/${auth.id}/education`} className={({ isActive }) =>
                                isActive
                                    ? `${primaryColor.text} font-bold flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group`
                                    : 'text-white-100 flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'
                            }>
                                <IoSchool className='text-2xl' />
                                <span className="ms-3">Educación</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`/user/edit/${auth.id}/experience`} className={({ isActive }) =>
                                isActive
                                    ? `${primaryColor.text} font-bold flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group`
                                    : 'text-white-100 flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'
                            }>
                                <MdWork className='text-2xl' />
                                <span className="ms-3">Experiencia</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`/user/edit/${auth.id}/project`} className={({ isActive }) =>
                                isActive
                                    ? `${primaryColor.text} font-bold flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group`
                                    : 'text-white-100 flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'
                            }>
                                <PiProjectorScreenChartFill className='text-2xl' />
                                <span className="ms-3">Proyectos</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    )
}

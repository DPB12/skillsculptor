import { Outlet } from 'react-router-dom'
import { Nav } from './Nav';
import { FooterEnd } from './FooterEnd';

export const Layout = () => {

    return (
        <>
            <Nav />
            <div className='flex flex-col min-h-screen'>
                <main className='flex-grow'>
                    <Outlet />
                </main>
                <FooterEnd />
            </div>
        </>
    )
}
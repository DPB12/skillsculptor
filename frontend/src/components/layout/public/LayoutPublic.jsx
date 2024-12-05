import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth';
import { Nav } from '../Nav';
import { FooterEnd } from '../FooterEnd';

export const LayoutPublic = () => {

    const { auth } = useAuth();

    return (
        <>
            <Nav />
            <div className='flex flex-col min-h-screen'>
                <main className='flex-grow'>
                    {!auth.id ? <Outlet /> : <Navigate to="/user" />}
                </main>
                <FooterEnd />
            </div>
        </>
    )
}
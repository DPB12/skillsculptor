import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth';
import { Nav } from '../Nav';
import { useTheme } from '../../../hooks/useTheme';

export const LayoutPrivate = () => {

    const { auth, loading } = useAuth();
    const { primaryColor } = useTheme();

    return (
        <>
            <Nav />
            {loading &&
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm z-50">
                    <div className={`loader border-8 ${primaryColor.border}`}></div>
                    <p className='text-center'>Estamos espiando... digo, cargando tus datos 👀</p>
                </div>
            }
            <main>
                {auth.id ? <Outlet /> : <Navigate to="/" />}
            </main>
        </>
    )
}
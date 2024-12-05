import { useEffect } from "react"
import { useAuth } from "../../../hooks/useAuth";
import { useTheme } from "../../../hooks/useTheme";

export const Logout = () => {

    const { setAuth } = useAuth();
    const { setPrimaryColor, availableColors, setTheme } = useTheme();

    useEffect(() => {
        /* Vaciar el localStorage */
        localStorage.clear();

        /* Setear estados globales a vacio */
        setAuth({});
        setPrimaryColor(availableColors[0]);
        setTheme('dark');
    });

    return (
        <h1>Cerrando sesion...</h1>
    )
}
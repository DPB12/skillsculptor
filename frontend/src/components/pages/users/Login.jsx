import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Global } from '../../../helpers/Global';
import { ApiRequests } from '../../../helpers/ApiRequests';
import { useAuth } from '../../../hooks/useAuth';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert } from '../../layout/Alert';
import signinimage from '../../../assets/img/undraw_welcome_cats_thqn.svg'
import { useTheme } from '../../../hooks/useTheme';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("El correo electrónico no es válido")
        .required("El correo electrónico es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria")
});

export const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const [statusError, setStatusError] = useState("");
    const [loading, setLoading] = useState(false);
    const { primaryColor } = useTheme();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema,
        onSubmit: values => {
            setLoading(true);
            signin(values);
        }
    });

    const signin = async (form) => {
        setServerError("");
        setStatusError("");
        let user = form;
        try {
            const { data, status } = await ApiRequests(`${Global.url}login`, "POST", user);
            if (status === 200) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setAuth(data.user);
                navigate(`/profiles/home/${data.user.id}`);
            } else if (status === 401) {
                setServerError("Contraseña incorrecta");
                setStatusError("error");
                setLoading(false);
            } else if (status === 404) {
                setServerError("No existe ninguna cuenta con este email");
                setStatusError("error");
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setServerError("Error en la solicitud, intenta más tarde.");
            setStatusError("warning");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row items-center h-screen px-3 mt-20 lg:mt-0">
            <div className="md:w-1/2 w-full">
                <form id='forms' className="relative py-4 px-5 max-w-sm mx-auto border border-gray-100 rounded-lg bg-gray-100 md:bg-white dark:bg-gray-800 dark:border-gray-700" onSubmit={formik.handleSubmit}>
                    <h1 className="text-center text-2xl font-semibold mb-4">Login</h1>
                    {loading &&
                        <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm z-10">
                            <div className={`loader border-8 ${primaryColor.border}`}></div>
                            <p className='text-center'>Entrando a la sala común... ¡abriendo el retrato! 🎨</p>
                        </div>
                    }
                    <div className="mb-5">
                        <label htmlFor="email" className={`block mb-2 text-sm font-medium ${formik.errors.email && formik.touched.email ? "text-red-700 dark:text-red-500" : "text-gray-900 dark:text-white"}`}>
                            Correo electronico
                        </label>
                        <input
                            type="email"
                            name="email"
                            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ${primaryColor.focusRing} ${primaryColor.focusBorder} block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                            ${formik.errors.email && formik.touched.email ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"}`}
                            placeholder="peter@anthony.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.email && formik.touched.email && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                <span className="font-medium">Oops!</span> {formik.errors.email}
                            </p>
                        )}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className={`block mb-2 text-sm font-medium ${formik.errors.password && formik.touched.password ? "text-red-700 dark:text-red-500" : "text-gray-900 dark:text-white"}`}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="********"
                            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ${primaryColor.focusRing} ${primaryColor.focusBorder} block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                            ${formik.errors.password && formik.touched.password ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"}`}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.password && formik.touched.password && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                <span className="font-medium">Oops!</span> {formik.errors.password}
                            </p>
                        )}
                    </div>
                    <div>
                        {serverError && <Alert message={serverError} status={statusError} />}
                    </div>
                    <div className='flex flex-col-reverse md:flex-row justify-between'>
                        <NavLink
                            className={`${primaryColor.text} rounded-lg w-full sm:w-auto px-5 py-2.5 text-center`}
                            to="/register">
                            Crear cuenta
                        </NavLink>

                        <button
                            type="submit"
                            className={`text-white ${primaryColor.bg} ${primaryColor.hover}  focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center`}>
                            Identificate
                        </button>
                    </div>
                </form>
            </div>

            <div className="hidden md:flex justify-center items-center md:my-5 lg:px-5">
                <img
                    src={signinimage}
                    className="max-w-full h-auto md:max-w-sm lg:max-w-xl xl:max-w-2xl object-contain"
                    alt="login-image"
                />
            </div>
        </div>
    );
};

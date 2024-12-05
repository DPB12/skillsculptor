import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Global } from '../../../helpers/Global';
import { ApiRequests } from '../../../helpers/ApiRequests';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert } from '../../layout/Alert';
import illustration from '../../../assets/img/undraw_account_re_o7id.svg'
import { useTheme } from '../../../hooks/useTheme';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("El campo nombre es obligatorio")
    .min(3, "El nombre tiene que tener al menos tres carácteres")
    .max(20, "El nombre no puede superar los 20 carácteres"),
  last_name: Yup.string()
    .required("El campo apellido es obligatorio")
    .min(3, "El apellido tiene que tener al menos tres carácteres")
    .max(50, "El apellido no puede superar los 50 carácteres"),
  email: Yup.string()
    .required("El email es obligatorio")
    .email("El email no tiene un formato válido"),
  emailrepeat: Yup.string()
    .oneOf([Yup.ref('email'), null], "Los correos electrónicos deben coincidir")
    .required("La confirmación de email es obligatoria"),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("Este campo es obligatorio"),
  passwordrepeat: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required("Este campo es obligatorio")
});

export const Register = () => {

  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [loading, setLoading] = useState(false);
  const { primaryColor } = useTheme();

  const formik = useFormik({
    initialValues: {
      name: "",
      last_name: "",
      email: "",
      emailrepeat: "",
      passwordrepeat: "",
      password: ""
    },
    validationSchema,
    onSubmit: values => {
      setLoading(true);
      signup(values);
    }
  });

  const signup = async (form) => {
    setServerError("");
    setStatusError("");
    let user = form;
    try {
      const { status } = await ApiRequests(`${Global.url}register`, "POST", user);
      if (status === 201) {
        navigate('/login');
      } else if (status === 400) {
        setServerError("El usuario ya existe");
        setStatusError("error");
        setLoading(false);
      }
    } catch (error) {
      setServerError("Error en la solicitud, intenta más tarde.");
      setStatusError("warning");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row items-center lg:h-screen px-3 mt-20 lg:mt-0">
      <div className="md:w-1/2 w-full hidden md:flex justify-center items-center px-5 mt-5 lg:mt-0">
        <img
          src={illustration}
          className="max-w-full h-auto md:max-w-lg lg:max-w-md xl:max-w-2xl object-contain"
          alt="login-image"
        />
      </div>

      <div className="md:w-1/2 w-full ">
        <form id='forms' className="relative py-4 px-5 max-w-lg mx-auto border border-gray-100 rounded-lg bg-gray-100 md:bg-white dark:bg-gray-800 dark:border-gray-700" onSubmit={formik.handleSubmit}>
          <h1 className="text-center text-2xl font-semibold mb-4">Registro</h1>
          {loading &&
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm z-10">
              <div className={`loader border-8 ${primaryColor.border}`}></div>
              <p className='text-center'>Cargando... ¡elfos trabajando!</p>
            </div>
          }
          <div className='flex flex-col md:flex-row md:space-x-4'>
            <div className='md:w-1/2'>
              <div>
                <label htmlFor="name" className={`block mb-2 text-sm font-medium ${formik.errors.name && formik.touched.name ? "text-red-700 dark:text-red-500" : "text-gray-900 dark:text-white"}`}>
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.name && formik.touched.name ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  placeholder="Peter"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.name && formik.touched.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.name}</p>
              )}
            </div>

            <div className='md:w-1/2'>
              <div>
                <label htmlFor="last_name" className={`block mb-2 text-sm font-medium ${formik.errors.last_name && formik.touched.last_name ? "text-red-700 dark:text-red-500" : "text-gray-900 dark:text-white"}`}>
                  Apellidos
                </label>
                <input
                  type="text"
                  name="last_name"
                  className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.last_name && formik.touched.last_name ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  placeholder="Anthony"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.last_name && formik.touched.last_name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.last_name}</p>
              )}
            </div>
          </div>

          <div className='flex flex-col md:flex-row md:space-x-4'>
            <div className='md:w-1/2'>
              <div>
                <label htmlFor="email" className={`block my-2 text-sm font-medium ${formik.errors.email && formik.touched.email ? "text-red-700 dark:text-red-500" : "text-gray-900 dark:text-white"}`}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.email && formik.touched.email ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  placeholder="peter@anthony.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.email && formik.touched.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.email}</p>
              )}
            </div>

            <div className='md:w-1/2'>
              <div>
                <label htmlFor="emailrepeat" className={`block my-2 text-sm font-medium ${formik.errors.emailrepeat && formik.touched.emailrepeat ? "text-red-700 dark:text-red-500" : "text-gray-900 dark:text-white"}`}>
                  Confirmar correo electrónico
                </label>
                <input
                  type="email"
                  name="emailrepeat"
                  className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.emailrepeat && formik.touched.emailrepeat ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  placeholder="peter@anthony.com"
                  value={formik.values.emailrepeat}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.emailrepeat && formik.touched.emailrepeat && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.emailrepeat}</p>
              )}
            </div>
          </div>

          <div className='flex flex-col md:flex-row md:space-x-4'>
            <div className='md:w-1/2'>
              <div>
                <label htmlFor="password" className={`block my-2 text-sm font-medium ${formik.errors.password && formik.touched.password ? "text-red-700 dark:text-red-500" : "text-gray-900 dark:text-white"}`}>
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.password && formik.touched.password ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  placeholder="********"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.password && formik.touched.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.password}</p>
              )}
            </div>

            <div className='md:w-1/2'>
              <div>
                <label htmlFor="passwordrepeat" className={`block my-2 text-sm font-medium ${formik.errors.passwordrepeat && formik.touched.passwordrepeat ? "text-red-700 dark:text-red-500" : "text-gray-900 dark:text-white"}`}>
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  name="passwordrepeat"
                  className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.passwordrepeat && formik.touched.passwordrepeat ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  placeholder="********"
                  value={formik.values.passwordrepeat}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.passwordrepeat && formik.touched.passwordrepeat && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.passwordrepeat}</p>
              )}
            </div>
          </div>
          <div>
            {serverError && <Alert message={serverError} status={statusError} />}
          </div>
          <div className='mt-5'>
            <button
              type="submit"
              className={`text-white ${primaryColor.bg} ${primaryColor.hover}  focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center`}>
              Crear cuenta
            </button>
          </div>
        </form>
      </div>


    </div>
  );
};

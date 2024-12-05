import React, { useState } from 'react'
import { ThemeMode } from '../../../layout/ThemeMode'
import { Sidebar } from './Sidebar'
import { Global } from '../../../../helpers/Global';
import { ApiRequests } from '../../../../helpers/ApiRequests';
import { useAuth } from '../../../../hooks/useAuth';
import { useFormik } from "formik";
import { Alert } from '../../../layout/Alert';
import avatar from '../../../../assets/img/default.png';
import { useTheme } from '../../../../hooks/useTheme';
import * as Yup from "yup";

const PHOTO_SUPPORTED_FORMATS = ["image/png", "image/jpg", "image/jpeg"];
const FILE_SIZE = 1024 * 1024;

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
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  passwordrepeat: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir'),
  image: Yup.mixed()
    .nullable()
    .test("fileFormat", "Formato de imagen inválido", (file) => {
      return !file || PHOTO_SUPPORTED_FORMATS.includes(file.type);
    })
    .test("fileSize", "El archivo es demasiado grande, máximo 1024KB", (file) => {
      return !file || file.size <= FILE_SIZE;
    }),
});

export const EditUser = () => {

  const [serverError, setServerError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [loading, setLoading] = useState(false);
  const { auth, setAuth } = useAuth();
  const { primaryColor, theme } = useTheme();

  const formik = useFormik({
    initialValues: {
      name: auth.name,
      last_name: auth.last_name,
      email: auth.email,
      emailrepeat: auth.email,
      password: "",
      passwordrepeat: "",
      image: null
    },
    validationSchema,
    onSubmit: values => {
      setLoading(true);
      edit(values);
    }
  });

  const edit = async (form) => {
    setServerError("");
    setStatusError("");
    let user = form;
    try {
      const token = localStorage.getItem('token');
      const { data, status } = await ApiRequests(`${Global.url}${auth.id}/edit/user`, "PUT", user, false, token);
      if (status === 200) {
        const updatedUser = {
          ...auth,
          ...data,
          theme: {
            ...auth.theme,
            ...data.theme
          }
        };
        setAuth(updatedUser);

        /* Subir imagen */
        const fileInput = document.querySelector("#file");
        if (status === 200 && fileInput.files[0]) {
          const formData = new FormData();
          formData.append("image", fileInput.files[0]);
          const { data, status } = await ApiRequests(`${Global.url}${auth.id}/upload`, "POST", formData, true, token);
          if (status === 201) {
            const updatedUser = {
              ...auth,
              ...data,
              theme: {
                ...auth.theme,
                ...data.theme
              }
            };
            setAuth(updatedUser);
          } else {
            setServerError("No se ha podido subir la imagen");
            setStatusError("error");
          }
        }
        setServerError("Usuario actualizado");
        setStatusError("success");
        setLoading(false);
      } else if (status === 400) {
        setServerError("Este email ya esta en uso");
        setStatusError("error");
        setLoading(false);
      } else if (status === 403) {
        setServerError("No tienes permisos para editar este usuario");
        setStatusError("error");
        setLoading(false);
      }
    } catch (error) {
      setServerError("Error en la solicitud, intenta más tarde");
      setStatusError("warning");
      setLoading(false);
      console.log(error);
    }
  };

  const handleImageChange = (event) => {
    formik.setFieldValue("image", event.currentTarget.files[0]);
  };

  return (
    <div className='md:container mb-10 mx-3 md:mx-auto flex flex-col md:flex-row mt-20 border border-gray-300 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900'>
      <div>
        <Sidebar />
      </div>
      <div className='w-full'>
        <form className="relative py-4 px-5" onSubmit={formik.handleSubmit}>
          <h1 className="text-center text-2xl font-semibold mb-4">Editar usuario</h1>
          {loading &&
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm z-10">
              <div className={`loader border-8 ${primaryColor.border}`}></div>
              <p className='text-center'>Reescribiendo la historia... ✍️</p>
            </div>
          }
          <div className='flex flex-col md:flex-row md:space-x-4'>
            <div className='md:w-1/2'>
              <div>
                <ThemeMode setThemeChange={(theme) => formik.setFieldValue("theme", theme)} />
              </div>
              <div>
                <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="image">
                  Avatar
                </label>
                <input
                  type="file"
                  name='image'
                  id='file'
                  className={`bg-gray-50 border text-sm rounded-lg block w-full ${formik.errors.image && formik.touched.image ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  onChange={handleImageChange}
                />
              </div>
              {formik.errors.image && formik.touched.image && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.image}</p>
              )}
            </div>
            <div className='md:w-1/2'>
              <div className='w-40 h-40 mx-auto mt-5 md:mt-0'>
                {auth.image === 'default.png' && (
                  <img className="w-full h-full object-cover rounded-full" src={avatar} alt="Bordered avatar" />
                )}
                {auth.image !== 'default.png' && (
                  <img className="w-full h-full object-cover rounded-full" src={`${Global.url}avatar/${auth.image}`} alt="Bordered avatar" />
                )}
              </div>
            </div>

          </div>
          <div className='flex flex-col md:flex-row md:space-x-4'>
            <div className='md:w-1/2'>
              <div>
                <label htmlFor="name" className="block mb-2 md:my-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.name && formik.touched.name ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  defaultValue={auth.name}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.name && formik.touched.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.name}</p>
              )}
            </div>
            <div className='md:w-1/2'>
              <div>
                <label htmlFor="last_name" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                  Apellidos
                </label>
                <input
                  type="text"
                  name="last_name"
                  className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.last_name && formik.touched.last_name ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  defaultValue={auth.last_name}
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
                <label htmlFor="email" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                  Correo electronico
                </label>
                <input
                  type="email"
                  name="email"
                  className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.email && formik.touched.email ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  defaultValue={auth.email}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.email && formik.touched.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.email}</p>
              )}
            </div>
            <div className='md:w-1/2'>
              <div>
                <label htmlFor="email" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirmar correo electronico
                </label>
                <input
                  type="email"
                  name="emailrepeat"
                  className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.emailrepeat && formik.touched.emailrepeat ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  defaultValue={auth.email}
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
                <label htmlFor="password" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.password && formik.touched.password ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
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
                <label htmlFor="passwordrepeat" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  name="passwordrepeat"
                  className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.passwordrepeat && formik.touched.passwordrepeat ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
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
              Actualizar
            </button>
          </div>
        </form>
      </div >
    </div >
  )
}

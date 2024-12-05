import React, { useEffect, useState } from 'react'
import { Global } from '../../../../helpers/Global';
import { ApiRequests } from '../../../../helpers/ApiRequests';
import { useAuth } from '../../../../hooks/useAuth';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert } from '../../../layout/Alert';
import { Dates } from '../../../layout/Dates';
import { useTheme } from '../../../../hooks/useTheme';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("El campo titulo es obligatorio")
    .min(3, "El titulo tiene que tener al menos tres carácteres")
    .max(50, "El titulo no puede superar los 50 carácteres"),
  company: Yup.string()
    .required("El campo empresa es obligatorio")
    .min(3, "La empresa tiene que tener al menos tres carácteres")
    .max(50, "La empresa no puede superar los 50 carácteres"),
  date: Yup.string()
    .required("El campo fecha es obligatorio"),
  page: Yup.string()
    .url("Debe ser un enlace válido")
    .nullable(),
});

export const Add = () => {

  const [serverError, setServerError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [loading, setLoading] = useState(false);
  const { auth, setAuth } = useAuth();
  const { primaryColor } = useTheme();

  useEffect(() => {
    if (statusError === "success") {
      formik.resetForm(); // Reinicia el formulario
    }
  }, [statusError]);

  const formik = useFormik({
    initialValues: {
      title: "",
      date: "",
      company: "",
      page: ""
    },
    validationSchema,
    onSubmit: values => {
      setLoading(true);
      add(values);
    }
  });

  const add = async (form) => {
    setServerError("");
    setStatusError("");
    let experience = form;
    try {
      const token = localStorage.getItem('token');
      const { data, status } = await ApiRequests(`${Global.url}${auth.portfolio.id}/experience`, "POST", experience, false, token);
      if (status === 201) {
        const updatedUser = {
          ...auth,
          portfolio: {
            ...auth.portfolio,
            experience: [...auth.portfolio.experience, data] // Añadir el nuevo proyecto al array
          }
        };
        setAuth(updatedUser);

        setServerError("Experiencia añadida correctamente");
        setStatusError("success");
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
    }
  };

  return (
    <div className='w-full'>
      <form className="relative py-4 px-5" onSubmit={formik.handleSubmit}>
        <h1 className="text-center text-2xl font-semibold mb-4">Añadir experiencia</h1>
        {loading &&
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm z-10">
            <div className={`loader border-8 ${primaryColor.border}`}></div>
            <p className='text-center'>Subiendo... casi listos. ⏳</p>
          </div>
        }
        <div className='flex flex-col md:flex-row'>
          <div className='w-full'>
            <div>
              <label htmlFor="title" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                Titulo
              </label>
              <input
                type="text"
                name="title"
                className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.title && formik.touched.title ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                value={formik.values.title}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.title && formik.touched.title && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.title}</p>
            )}
          </div>
        </div>
        <div className='flex flex-col md:flex-row md:space-x-4'>
          <div className='md:w-1/2'>
            <div>
              <label htmlFor="company" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                Empresa
              </label>
              <input
                type="text"
                name="company"
                className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.company && formik.touched.company ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                value={formik.values.company}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.company && formik.touched.company && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.company}</p>
            )}
          </div>
          <div className='md:w-1/2'>
            <div>
              <label htmlFor="page" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                Página de la empresa
              </label>
              <input
                type="text"
                name="page"
                className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.page && formik.touched.page ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                value={formik.values.page}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.page && formik.touched.page && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.page}</p>
            )}
          </div>
        </div>
        <Dates setDate={(date) => formik.setFieldValue("date", date)} rangeDatePicker={true} formik={formik} />
        <div>
          {serverError && <Alert message={serverError} status={statusError} />}
        </div>
        <div className='mt-5'>
          <button
            type="submit"
            className={`text-white ${primaryColor.bg} ${primaryColor.hover} focus:ring-4 focus:outline-none ${primaryColor.focusRing} font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center`}>
            Añadir
          </button>
        </div>
      </form>
    </div>
  )
}
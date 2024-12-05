import React, { useEffect, useState } from 'react'
import { Global } from '../../../../helpers/Global';
import { ApiRequests } from '../../../../helpers/ApiRequests';
import { useAuth } from '../../../../hooks/useAuth';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert } from '../../../layout/Alert';
import { useTheme } from '../../../../hooks/useTheme';

const PHOTO_SUPPORTED_FORMATS = ["image/png", "image/jpg", "image/jpeg"];
const FILE_SIZE = 1024 * 1024;

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("El campo titulo es obligatorio")
    .min(3, "El titulo tiene que tener al menos tres carácteres")
    .max(50, "El titulo no puede superar los 50 carácteres"),
  description: Yup.string()
    .required("El campo descripción es obligatorio")
    .min(10, "El descripción tiene que tener al menos 10 carácteres")
    .max(500, "El descripción no puede superar los 500 carácteres"),
  demo: Yup.string()
    .url("Debe ser un enlace válido")
    .nullable(),
  github: Yup.string()
    .url("Debe ser un enlace válido")
    .nullable(),
  image: Yup.mixed()
    .nullable()
    .test("fileFormat", "Formato de imagen inválido", (file) => {
      return !file || PHOTO_SUPPORTED_FORMATS.includes(file.type);
    })
    .test("fileSize", "El archivo es demasiado grande, máximo 1024KB", (file) => {
      return !file || file.size <= FILE_SIZE;
    }),
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
      description: "",
      demo: "",
      github: "",
      image: null
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
    let project = form;
    try {
      const token = localStorage.getItem('token');
      const { data, status } = await ApiRequests(`${Global.url}${auth.portfolio.id}/project`, "POST", project, false, token);
      if (status === 201) {

        /* Subir imagen */
        const fileInput = document.querySelector("#file1");
        const id = data.id;
        if (status === 201 && fileInput.files[0]) {
          const formData = new FormData();
          formData.append("image", fileInput.files[0]);
          const { data, status } = await ApiRequests(`${Global.url}project/${id}/upload`, "POST", formData, true, token);
          if (status === 201) {
            const updatedUser = {
              ...auth,
              portfolio: {
                ...auth.portfolio,
                project: [...auth.portfolio.project, data] 
              }
            };
            setAuth(updatedUser);
          } else {
            setServerError("No se ha podido subir la imagen");
            setStatusError("error");
          }
        } else {
          const updatedUser = {
            ...auth,
            portfolio: {
              ...auth.portfolio,
              project: [...auth.portfolio.project, data] 
            }
          };
          setAuth(updatedUser);
        }

        setServerError("Proyecto añadido correctamente");
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

  const handleImageChange = (event) => {
    formik.setFieldValue("image", event.currentTarget.files[0]);
  };

  return (

    <div className='w-full'>
      <form className="relative py-4 px-5" onSubmit={formik.handleSubmit}>
        <h1 className="text-center text-2xl font-semibold mb-4">Añadir nuevo proyecto</h1>
        {loading &&
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm z-10">
            <div className={`loader border-8 ${primaryColor.border}`}></div>
            <p className='text-center'>Subiendo... casi listos. ⏳</p>
          </div>
        }
        <div className='flex flex-col md:flex-row md:space-x-4'>
          <div className='md:w-1/2'>
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
          <div className='md:w-1/2'>
            <div>
              <label htmlFor="image" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                Subir imagen
              </label>
              <input
                type="file"
                name='image'
                id='file1'
                className={`bg-gray-50 border text-sm rounded-lg block w-full ${formik.errors.image && formik.touched.image ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                onChange={handleImageChange}
              />
            </div>
            {formik.errors.image && formik.touched.image && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.image}</p>
            )}
          </div>
        </div>
        <div className='flex flex-col md:flex-row md:space-x-4'>
          <div className='md:w-1/2'>
            <div>
              <label htmlFor="demo" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                Página demo
              </label>
              <input
                type="text"
                name="demo"
                className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.demo && formik.touched.demo ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                value={formik.values.demo}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.demo && formik.touched.demo && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.demo}</p>
            )}
          </div>
          <div className='md:w-1/2'>
            <div>
              <label htmlFor="github" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                Enlace repositorio GitHub
              </label>
              <input
                type="text"
                name="github"
                className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.github && formik.touched.github ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                value={formik.values.github}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.github && formik.touched.github && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.github}</p>
            )}
          </div>
        </div>
        <div className='flex flex-col md:flex-row'>
          <div className='w-full'>
            <div>
              <label htmlFor="description" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                Descripción
              </label>
              <textarea
                name="description"
                className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 ${formik.errors.description && formik.touched.description ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" : "border-gray-300 text-gray-900"} ${primaryColor.focusRing} ${primaryColor.focusBorder} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.description && formik.touched.description && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.description}</p>
            )}
          </div>
        </div>
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
import React, { useState } from 'react';
import { Modal } from "flowbite-react";
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

export const Update = ({ experience }) => {

    const [openModal, setOpenModal] = useState(false);
    const [serverError, setServerError] = useState("");
    const [statusError, setStatusError] = useState("");
    const [loading, setLoading] = useState(false);
    const { auth, setAuth } = useAuth();
    const { primaryColor } = useTheme();

    const formik = useFormik({
        initialValues: {
            title: experience.title,
            date: experience.date,
            company: experience.company,
            page: experience.page
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
        let dataSave = form;
        try {
            const token = localStorage.getItem('token');
            const { data, status } = await ApiRequests(`${Global.url}${experience.id}/edit/experience`, "PUT", dataSave, false, token);
            if (status === 200) {
                const updatedUser = {
                    ...auth,
                    portfolio: {
                        ...auth.portfolio,
                        experience: auth.portfolio.experience.map(exp =>
                            exp.id === experience.id ? { ...exp, ...data } : exp
                        )
                    }
                };
                setAuth(updatedUser);

                setServerError("Experiencia actualizada correctamente");
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
        <>
            <button
                className={`text-white ${primaryColor.bg} ${primaryColor.hover} focus:ring-4 focus:outline-none ${primaryColor.focusRing} font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
                onClick={() => setOpenModal(true)}>
                Editar
            </button>

            <Modal show={openModal} size="2xl" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <form className="py-4 px-5" onSubmit={formik.handleSubmit}>
                        <h1 className="text-center text-2xl font-semibold mb-4">Editar experiencia</h1>
                        {loading &&
                            <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm z-10">
                                <div className={`loader border-8 ${primaryColor.border}`}></div>
                                <p className='text-center'>Reescribiendo la historia... ✍️</p>
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
                                        defaultValue={experience.title}
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
                                        defaultValue={experience.company}
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
                                        defaultValue={experience.page}
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
                                Actualizar
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

import React, { useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { Button, Modal } from 'flowbite-react';
import { ApiRequests } from '../../../../helpers/ApiRequests';
import { Global } from '../../../../helpers/Global';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Alert } from '../../../layout/Alert';
import { useTheme } from '../../../../hooks/useTheme';

export const Remove = ({ id }) => {
    const [serverError, setServerError] = useState("");
    const [statusError, setStatusError] = useState("");
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const { auth, setAuth } = useAuth();
    const { primaryColor } = useTheme();

    const deleteEducation = async () => {
        setServerError("");
        setStatusError("");
        setLoading(true); // Iniciamos el estado de carga
        try {
            const token = localStorage.getItem('token');
            const { status } = await ApiRequests(`${Global.url}${id}/delete/education`, "DELETE", undefined, false, token);
            if (status === 204) {
                const updatedEducations = auth.portfolio.education.filter(edu => edu.id !== id);
                setAuth({
                    ...auth,
                    portfolio: {
                        ...auth.portfolio,
                        education: updatedEducations
                    }
                });
                setServerError("Formación eliminada correctamente");
                setStatusError("success");
                setLoading(false);
            } else {
                setServerError("Error al eliminar la formación");
                setStatusError("error");
                setLoading(false);
            }
        } catch (error) {
            setServerError("Error en la solicitud, intenta más tarde.");
            setStatusError("warning");
            setLoading(false);
        }
    };

    const handleDelete = () => {
        setOpenModal(false);
        deleteEducation();
    };

    return (
        <div>
            <button
                type="button"
                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                onClick={() => setOpenModal(true)}
            >
                Eliminar
            </button>

            {/* Modal de confirmación */}
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            ¿Estás seguro de que deseas eliminar esta formación?
                        </h3>

                        {loading ? (
                            <div className="flex flex-col justify-center items-center">
                                <div className={`loader border-8 ${primaryColor.border}`}></div>
                                <p className='text-center'>Desintegrando... 💥</p>
                            </div>
                        ) : (
                            <div className="flex justify-center gap-4">
                                <Button color="failure" onClick={handleDelete}>
                                    Sí, estoy seguro
                                </Button>
                                <Button color="gray" onClick={() => setOpenModal(false)}>
                                    No, cancelar
                                </Button>
                            </div>
                        )}
                    </div>
                </Modal.Body>
            </Modal>

            <div>
                {serverError && <Alert message={serverError} status={statusError} />}
            </div>
        </div>
    );
};

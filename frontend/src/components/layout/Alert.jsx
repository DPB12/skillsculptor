import React from 'react';
import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

export const Alert = ({ message, status }) => {

    const renderToast = () => {
        switch (status) {
            case "success":
                return (
                    <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500 text-white dark:bg-green-800 dark:text-green-200">
                            <HiCheck className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">{message}</div>
                        <Toast.Toggle />
                    </Toast>
                );
            case "error":
                return (
                    <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white bg-red-600">
                            <HiX className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">{message}</div>
                        <Toast.Toggle />
                    </Toast>
                );
            case "warning":
                return (
                    <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                            <HiExclamation className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">{message}</div>
                        <Toast.Toggle />
                    </Toast>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-80 z-30 py-3 px-3">
            {renderToast()}
        </div>
    );
};

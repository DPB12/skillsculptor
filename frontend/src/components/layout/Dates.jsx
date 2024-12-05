import React, { useEffect, useState } from 'react';
import { Datepicker } from 'flowbite-react';
import { useTheme } from '../../hooks/useTheme';

export const Dates = ({ setDate, rangeDatePicker, formik }) => {

    const { primaryColor } = useTheme();

    const customTheme = {
        "popup": {
            "footer": {
                "base": "mt-2 flex space-x-2",
                "button": {
                    "base": "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-cyan-300",
                    "today": `${primaryColor.bg} text-white ${primaryColor.hover}`,
                    "clear": "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                }
            }
        },
        "views": {
            "days": {
                "items": {
                    "base": "grid w-64 grid-cols-7",
                    "item": {
                        "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                        "selected": `${primaryColor.bg} text-white ${primaryColor.hover}`,
                        "disabled": "text-gray-500"
                    }
                }
            },
        }
    };

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [isChecked, setIsChecked] = useState(false);

    const now = new Date();
    const minDate = new Date(now.getFullYear() - 70, now.getMonth(), now.getDate()); // 70 años atrás

    useEffect(() => {
        formatDateToString();
    }, [startDate, endDate, isChecked, rangeDatePicker]);

    const formatDateToString = () => {
        if (rangeDatePicker) {
            if (startDate && endDate) {
                if (isChecked) {
                    setDate(`${startDate.toLocaleString('es-ES', { month: 'long' })}/${startDate.getFullYear()} - Actualmente`);
                } else {
                    setDate(`${startDate.toLocaleString('es-ES', { month: 'long' })}/${startDate.getFullYear()} - ${endDate.toLocaleString('es-ES', { month: 'long' })}/${endDate.getFullYear()}`);
                }
            }
        } else {
            if (endDate) {
                if (isChecked) {
                    setDate("Actualmente");
                } else {
                    setDate(`${endDate.getFullYear()}`);
                }
            }
        }
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (endDate && date > endDate) {
            setEndDate(date);
        }
    };

    const handleEndDateChange = (date) => {
        if (date < startDate) {
            setStartDate(date);
        }
        setEndDate(date);
    };

    const handleCheckboxChange = () => {
        setIsChecked((prev) => !prev);
        if (!isChecked) {
            setEndDate(now);
        }
    };

    if (rangeDatePicker) {
        return (
            <div className='flex flex-col md:flex-row md:space-x-4'>
                <div className='md:w-1/2'>
                    <div >
                        <label htmlFor="start-date" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                            Fecha de inicio
                        </label>
                        <Datepicker
                            id="date-color"
                            language="es-ES"
                            labelTodayButton="Hoy"
                            labelClearButton="Limpiar"
                            weekStart={1}
                            theme={customTheme}
                            minDate={minDate}
                            maxDate={now}
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </div>
                    {formik.errors.date && formik.touched.date && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.date}</p>
                    )}
                </div>

                <div className='md:w-1/2'>
                    <div>
                        <label htmlFor="end-date" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                            Fecha de fin
                        </label>
                        <Datepicker
                            id="date-color"
                            language="es-ES"
                            labelTodayButton="Hoy"
                            labelClearButton="Limpiar"
                            weekStart={1}
                            theme={customTheme}
                            minDate={minDate}
                            maxDate={now}
                            value={isChecked ? now : endDate}
                            onChange={handleEndDateChange}
                            disabled={isChecked}
                        />
                    </div>
                    {formik.errors.date && formik.touched.date && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.date}</p>
                    )}

                    <div className='flex space-x-2 items-center'>
                        <input
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            type="checkbox"
                            className={`w-4 h-4 ${primaryColor.text} bg-gray-100 border-gray-300 rounded ${primaryColor.focusRing} dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}
                        />
                        <label htmlFor="currently" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                            Actualmente
                        </label>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <label htmlFor="date" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                    Fecha de finalización
                </label>
                <Datepicker
                    id="date-color"
                    language="es-ES"
                    labelTodayButton="Hoy"
                    labelClearButton="Limpiar"
                    weekStart={1}
                    theme={customTheme}
                    minDate={minDate}
                    maxDate={now}
                    value={isChecked ? now : endDate}
                    onChange={handleEndDateChange}
                    disabled={isChecked}
                />
                {formik.errors.date && formik.touched.date && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.date}</p>
                )}
                <div className='flex space-x-2 items-center'>
                    <input
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        type="checkbox"
                        className={`w-4 h-4 ${primaryColor.text} bg-gray-100 border-gray-300 rounded ${primaryColor.focusRing} dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}
                    />
                    <label htmlFor="currently" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                        Actualmente
                    </label>
                </div>
            </div>
        )
    }
}

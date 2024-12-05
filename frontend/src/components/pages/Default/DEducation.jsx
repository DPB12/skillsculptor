import React, { useEffect, useState } from 'react';
import { Pagination } from "flowbite-react";
import image from '../../../assets/img/undraw_educator_re_ju47.svg';
import { useTheme } from '../../../hooks/useTheme';

export const DEducation = () => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [currentItems, setCurrentItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const {primaryColor} = useTheme();

  const educationItems = [
    {
      date: 'June 2024',
      title: 'Grado en Ingeniería Informática - Universidad Complutense de Madrid'
    },
    {
      date: 'June 2020',
      title: 'Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web - IES Juan de la Cierva'
    },
    {
      date: 'June 2018',
      title: 'Ciclo Formativo de Grado Medio en Sistemas Microinformáticos y Redes - IES Clara del Rey'
    },
    {
      date: 'June 2016',
      title: 'Bachillerato Tecnológico - Colegio San Ignacio de Loyola'
    }
  ];

  useEffect(() => {
    const total = educationItems.length;
    setTotalPages(Math.ceil(total / itemsPerPage));
    const items = educationItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    setCurrentItems(items);
  }, [currentPage, itemsPerPage]);

  const onPageChange = (page) => setCurrentPage(page);

  return (
    <>
      <div className='flex flex-row items-center justify-evenly md:h-screen px-5 mt-10 md:mt-0 space-x-5'>
        <div className="w-2/5 hidden md:flex items-center justify-center">
          <img
            src={image}
            className="lg:max-w-md object-contain"
            alt="education-image"
          />
        </div>

        <div className='w-full md:w-1/2'>
          <ol className={`relative border-s ${primaryColor.border}`}>
            {currentItems.map((item, index) => (
              <li key={index} className="mt-10 ms-4">
                <div className={`absolute w-3 h-3 rounded-full mt-1.5 -start-1.5 border ${primaryColor.border} ${primaryColor.bg}`}></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{item.date}</time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              </li>
            ))}
          </ol>
          {totalPages > 1 &&
            <div className="flex justify-center mt-5">
              <Pagination
                layout="navigation"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                nextLabel="Siguiente"
                previousLabel="Anterior"
              />
            </div>
          }
        </div>
      </div>
    </>
  );
};

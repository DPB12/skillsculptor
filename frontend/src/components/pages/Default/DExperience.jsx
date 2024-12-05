import React, { useEffect, useState } from 'react';
import { Pagination } from "flowbite-react";
import image from '../../../assets/img/undraw_working_re_ddwy.svg';
import { useTheme } from '../../../hooks/useTheme';

export const DExperience = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [currentItems, setCurrentItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const {primaryColor} = useTheme();

  const experiencesItems = [
    {
      date: 'January 2024 - Actualmente',
      title: 'Ingeniero de Software Senior',
      company: 'NASA - Jet Propulsion Laboratory',
      page: 'https://www.nasa.gov/'
    },
    {
      date: 'September 2021 - December 2023',
      title: 'Desarrollador Full Stack',
      company: 'Google Cloud'
    },
    {
      date: 'June 2020 - August 2021',
      title: 'Desarrollador Backend',
      company: 'Amazon Web Services',
      page: 'https://aws.amazon.com/es/'
    },
    {
      date: 'February 2018 - May 2020',
      title: 'Ingeniero de Software',
      company: 'Microsoft - Azure'
    },
    {
      date: 'July 2016 - January 2018',
      title: 'Técnico de Sistemas',
      company: 'IBM España'
    },
    {
      date: 'August 2014 - June 2016',
      title: 'Desarrollador Junior',
      company: 'Indra Sistemas'
    }
  ];

  useEffect(() => {
    const total = experiencesItems.length;
    setTotalPages(Math.ceil(total / itemsPerPage));
    const items = experiencesItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
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
                {item.page ?
                  <a href={item.page} className={`mb-4 text-base font-normal ${primaryColor.text}`} target="_blank" rel="noopener noreferrer">
                    {item.company}
                  </a>
                  :
                  <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{item.company}</p>
                }
              </li>
            ))}
          </ol>
          {totalPages > 1 &&
            <div className="flex justify-center">
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

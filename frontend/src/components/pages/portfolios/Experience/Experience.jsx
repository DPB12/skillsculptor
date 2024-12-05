import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { useProfile } from '../../../../hooks/useProfile';
import image from '../../../../assets/img/undraw_working_re_ddwy.svg';
import { Pagination } from "flowbite-react";
import { useTheme } from '../../../../hooks/useTheme';

export const Experience = () => {

  const { userid } = useParams();
  const { auth } = useAuth();
  const { primaryColor } = useTheme();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [currentItems, setCurrentItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const { profile, loading } = useProfile(userid);

  useEffect(() => {
    if (!loading) {
      if (profile.portfolio.experience) {
        const experience = profile.portfolio.experience;
        // Calcular el total de páginas y los elementos actuales
        setTotalPages(Math.ceil(experience.length / itemsPerPage));
        setCurrentItems(experience.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
      } else {
        setTotalPages(0);
        setCurrentItems([]);
      }
    }
  }, [profile, currentPage, itemsPerPage]);

  const onPageChange = (page) => setCurrentPage(page);

  return (
    <>
      <div className='flex flex-row items-center justify-evenly md:h-screen px-5 mt-10 md:mt-0 space-x-5'>
        {loading ?
          <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm z-50">
            <div className={`loader border-8 ${primaryColor.border}`}></div>
            <p className='text-center'>Preparando el espectáculo... 🎭</p>
          </div>
          :
          <>
            {currentItems.length === 0 ? (
              <h1>No hay información</h1>
            ) : (
              <>
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
                    )).reverse()}
                  </ol>
                  {totalPages > 1 && (
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
                  )}
                </div>
              </>
            )}
          </>
        }
      </div>
    </>
  )
}

import { Sidebar } from './Sidebar'
import { Global } from '../../../../helpers/Global';
import { useAuth } from '../../../../hooks/useAuth';
import { Add } from '../../portfolios/Education/Add';
import { Accordion } from "flowbite-react";
import { Remove } from '../../portfolios/Education/Remove';
import { Update } from '../../portfolios/Education/Update';

export const EdiEducation = () => {

  const { auth } = useAuth();

  return (
    <div className='md:container mx-3 mb-10 md:mx-auto flex flex-col md:flex-row mt-20 border border-gray-300 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900'>
      <div>
        <Sidebar />
      </div>
      <div className='w-full flex flex-col'>
        <Add />
        <div>
          {auth.portfolio.education.length !== 0 &&
            <div>
              <Accordion>
                {auth.portfolio.education.map((item, index) => (
                  <Accordion.Panel key={index}>
                    <Accordion.Title>
                      <div className='flex space-x-4'>
                        <p>{item.title}</p>
                        <p>|</p>
                        <p>{item.date}</p>
                      </div>
                    </Accordion.Title>
                    <Accordion.Content>
                      <div className='flex justify-center space-x-4'>
                        <Update education={item} />
                        <Remove id={item.id} />
                      </div>
                    </Accordion.Content>
                  </Accordion.Panel>
                )).reverse()}
              </Accordion>
            </div>
          }
        </div>
      </div >
    </div >
  )
}

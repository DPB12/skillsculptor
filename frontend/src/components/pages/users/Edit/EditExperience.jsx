import { Sidebar } from './Sidebar'
import { useAuth } from '../../../../hooks/useAuth';
import { Add } from '../../portfolios/Experience/Add';
import { Accordion } from "flowbite-react";
import { Remove } from '../../portfolios/Experience/Remove';
import { Update } from '../../portfolios/Experience/Update';
import { useTheme } from '../../../../hooks/useTheme';

export const EdiExperience = () => {

  const { auth } = useAuth();
  const { primaryColor } = useTheme();

  return (
    <div className='md:container mx-3 mb-10 md:mx-auto flex flex-col md:flex-row mt-20 border border-gray-300 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900'>
      <div>
        <Sidebar />
      </div>
      <div className='w-full flex flex-col'>
        <Add />
        <div>
          {auth.portfolio.experience.length !== 0 &&
            <div>
              <Accordion>
                {auth.portfolio.experience.map((item, index) => (
                  <Accordion.Panel key={index}>
                    <Accordion.Title>
                      <div className='flex space-x-4'>
                        <p>{item.title}</p>
                        <p>|</p>
                        <p>{item.date}</p>
                        {item.page ?
                          <a href={item.page} className={`mb-4 text-base font-normal ${primaryColor.text}`} target="_blank" rel="noopener noreferrer">
                            {item.company}
                          </a>
                          :
                          <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{item.company}</p>
                        }
                      </div>
                    </Accordion.Title>
                    <Accordion.Content>
                      <div className='flex justify-center space-x-4'>
                        <Update experience={item} />
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

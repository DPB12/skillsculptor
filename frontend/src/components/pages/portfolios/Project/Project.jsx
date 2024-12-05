import { useAuth } from '../../../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { useProfile } from '../../../../hooks/useProfile';
import { Global } from '../../../../helpers/Global';
import { useTheme } from '../../../../hooks/useTheme';

export const Project = () => {

  const { userid } = useParams();
  const { auth } = useAuth();
  const { primaryColor } = useTheme();

  const { profile, loading } = useProfile(userid);

  return (
    <div className={`flex flex-wrap justify-center items-center ${profile?.portfolio?.project?.length === 0 ? 'h-screen mt-0 mb-0' : 'mt-20 mb-10 '}`}>
      {loading ?
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm z-50">
          <div className={`loader border-8 ${primaryColor.border}`}></div>
          <p className='text-center'>Preparando el espectáculo... 🎭</p>
        </div>
        :
        <>
          {profile.portfolio.project.length === 0 ? (
            <h1>No hay información</h1>
          ) : (
            <>
              {profile.portfolio.project.map((item, index) => (
                <div key={index} className="w-80 m-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  {item.image &&
                    <img className="rounded-t-lg w-80 h-64 mx-auto object-cover" src={`${Global.url}image/${item.image}`} alt="" />
                  }
                  <div className="p-5">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.title}</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item.description}</p>
                    <div className='flex flex-col-reverse md:flex-row justify-evenly space-x-2'>
                      {item.demo &&
                        <a href={item.demo} className={`inline-flex items-center my-3 md:my-0 px-3 py-2 text-sm font-medium text-center text-white ${primaryColor.bg} rounded-lg ${primaryColor.hover} focus:ring-4 focus:outline-none ${primaryColor.focusRing}`}>Demo</a>
                      }
                      {item.github &&
                        <a href={item.github} className={`inline-flex items-center my-3 md:my-0 px-3 py-2 text-sm font-medium text-center text-white ${primaryColor.bg} rounded-lg ${primaryColor.hover} focus:ring-4 focus:outline-none ${primaryColor.focusRing}`}>GitHub</a>
                      }
                    </div>
                  </div>
                </div>
              )).reverse()}
            </>
          )}
        </>
      }
    </div>
  )
}

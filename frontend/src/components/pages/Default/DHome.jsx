import userimage from '../../../assets/img/avatar.jpg'
import { useTheme } from '../../../hooks/useTheme';
import { Stack } from '../portfolios/Stack';

export const DHome = () => {

  const { primaryColor } = useTheme();

  return (
    <>
      <div className='flex flex-col md:flex-row items-center lg:h-screen px-2 mt-16 md:mt-20 lg:mt-0 md:px-10'>
        <div className='w-full md:w-3/5'>
          <h1 className={`text-4xl mb-2 ${primaryColor.text}`}>Peter Anthony</h1>
          <h2 className='text-2xl mb-2'>Especialista en Soluciones Cloud</h2>
          <p className='text-justify'>Profesional con más de 5 años de experiencia en la implementación y gestión de soluciones en la nube, con un enfoque en la optimización de infraestructuras tecnológicas para empresas. Experto en plataformas como AWS, Azure y Google Cloud, combinando conocimientos en DevOps para automatizar procesos y garantizar una alta disponibilidad y escalabilidad de sistemas. Destacado por su capacidad para liderar proyectos de migración a la nube, integrar tecnologías de contenedores como Docker y Kubernetes, y automatizar flujos de trabajo mediante CI/CD. Apasionado por crear entornos eficientes y seguros que impulsen la innovación y el crecimiento del negocio.</p>
          <Stack languages={['html', 'css', 'javascript', 'vuejs', 'typescript', 'react']} />
        </div>
        <div className='md:flex justify-center md:w-2/5'>
          <img className="w-64 h-64 lg:w-80 lg:h-80 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 object-cover" src={userimage} alt="Bordered avatar" />
        </div>
      </div>
    </>
  )
}

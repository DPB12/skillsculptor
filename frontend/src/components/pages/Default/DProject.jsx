import twitch from '../../../assets/img/twitch.png';
import portfolio from '../../../assets/img/portfolio.png';
import platform from '../../../assets/img/platform.png';
import { useTheme } from '../../../hooks/useTheme';

export const DProject = () => {

  const { primaryColor } = useTheme();

  const projectsItems = [
    {
      title: 'Twitch Clone',
      description: 'Un clon de la popular plataforma de streaming Twitch, que permite a los usuarios transmitir y ver contenido en vivo. Incluye funciones de chat en tiempo real y seguimiento de usuarios.',
      demo: 'https://twitch-clone-demo.example.com',
      github: 'https://github.com/usuario/twitch-clone',
      image: twitch
    },
    {
      title: 'Portfolio Personal',
      description: 'Un sitio web personal diseñado para mostrar proyectos y habilidades. Incluye una sección de contacto y una galería de proyectos destacados.',
      demo: 'https://mi-portfolio.example.com',
      github: '',
      image: portfolio
    },
    {
      title: 'E-commerce Platform',
      description: 'Plataforma de comercio electrónico que permite a los usuarios comprar y vender productos. Incluye gestión de inventario y pasarelas de pago.',
      demo: '',
      github: 'https://github.com/usuario/ecommerce-platform',
      image: platform
    },
    {
      title: 'Blog de Viajes',
      description: 'Un blog que permite a los usuarios compartir sus experiencias de viaje. Incluye funcionalidad de comentarios y suscripción al boletín.',
      demo: 'https://blog-de-viajes.example.com',
      github: 'https://github.com/usuario/blog-de-viajes'
    },
    {
      title: 'Gestor de Tareas',
      description: 'Aplicación web para la gestión de tareas que permite a los usuarios crear, editar y eliminar tareas, y organizarlas por prioridades.',
      demo: '',
      github: ''
    },
    {
      title: 'Red Social para Desarrolladores',
      description: 'Una red social diseñada específicamente para desarrolladores, donde pueden compartir proyectos, realizar preguntas y colaborar en trabajos.',
      demo: 'https://red-social-desarrolladores.example.com',
      github: 'https://github.com/usuario/red-social-desarrolladores'
    },
    {
      title: 'Foro de Discusión',
      description: 'Un foro en línea que permite a los usuarios iniciar discusiones sobre diversos temas y participar en conversaciones.',
      demo: '',
      github: 'https://github.com/usuario/foro-de-discusion'
    },
  ];

  return (
    <div className='mt-20 mb-10 flex flex-wrap justify-center items-center'>
      {projectsItems.map((item, index) =>
        <div key={index} className="max-w-sm m-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          {item.image &&
            <img className="rounded-t-lg w-full h-64 object-cover" src={item.image} alt="" />
          }
          <div className="p-5">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.title}</h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item.description}</p>
            <div className='flex flex-col-reverse md:flex-row justify-evenly'>
              {item.demo &&
                <a href={item.demo} className={`inline-flex items-center my-3 md:my-0 px-3 py-2 text-sm font-medium text-center text-white ${primaryColor.bg} rounded-lg ${primaryColor.hover} focus:ring-4 focus:outline-none ${primaryColor.focusRing}`}>Demo</a>
              }
              {item.github &&
                <a href={item.github} className={`inline-flex items-center my-3 md:my-0 px-3 py-2 text-sm font-medium text-center text-white ${primaryColor.bg} rounded-lg ${primaryColor.hover} focus:ring-4 focus:outline-none ${primaryColor.focusRing}`}>GitHub</a>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

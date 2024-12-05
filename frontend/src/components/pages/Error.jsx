import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'

export const Error = () => {

  const { primaryColor } = useTheme();

  return (
    <section className="flex items-center h-screen p-16 bg-gray-50 text-gray-800">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl text-gray-400">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">Lo siento, no pudimos encontrar esta página...</p>
          <p className="mt-4 mb-8 text-gray-600">Pero no te preocupes, puedes encontrar muchas otras cosas en nuestra página de inicio</p>
          <NavLink to={`/`} className={`px-8 py-3 font-semibold rounded ${primaryColor.bg} text-gray-50`}>
            Volver a la página de inicio
          </NavLink>
        </div>
      </div>
    </section>
  )
}

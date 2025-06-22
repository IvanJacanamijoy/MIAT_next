"use client";
import Link from "next/link";
export default function HomeForm({ onSubmit, styles, inputs, error, isLoading, buttonText = 'Enviar' }) {

  return (
    <>
      <form onSubmit={onSubmit} className={styles} method='POST'>
        {inputs.map((input, index) => (
          <div key={index} className="mb-4">
            <label htmlFor={input.label} className="block text-md font-semibold text-gray-700">
              {input.label}
              <div className='relative mt-1'>

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {
                    index == 1 ?
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                      :
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>

                  }
                </div>
                <input
                  type={input.type}
                  id={input.label}
                  value={input.value}
                  onChange={input.onChange}
                  placeholder={input.placeholder}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-red-600"
                  disabled={input.disabled}
                />
              </div>
            </label>
          </div>
        ))}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="flex space-x-4">

          <button
            type="submit"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full cursor-pointer"
          >
            Ingresar
          </button>
        </div>
        <p className="text-center text-gray-600 text-sm mt-4">
          ¿No tienes una cuenta? <Link href="/register" className="text-red-500 hover:text-red-800">Regístrate aquí</Link>
        </p>
      </form>
    </>
  )
}
import React from 'react'
import { useForm } from "react-hook-form"

export default function ForgotPassword() {
  const {register, handleSubmit, formState: { errors }, reset} = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };
  return (
    <>
       <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
        Forgot password?
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" action="#" method="POST">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder='example@gmail.com'
                className="block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
              />
               {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <button type="submit"
              className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

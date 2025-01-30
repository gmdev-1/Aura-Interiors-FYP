import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signup } from '../services/authService';

export default function Signup() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onChangePassword = (event) => {
    setPasswordValue(event.target.value);
  };

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await signup({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'user'
      });

      if (response) {
        alert('Registration successful! Please login.');
        reset();
        navigate('/auth/login');
      }
    } catch (error) {
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('An error occurred during registration');
      }
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex flex-col items-center">
            <span className="font-cinzel text-2xl md:text-3xl font-bold tracking-wider group-hover:text-purple-500 transition-colors duration-300">
              AURA
            </span>
            <span className="font-playfair text-sm md:text-base tracking-[0.3em] group-hover:text-purple-400 transition-colors duration-300">
              INTERIORS
            </span>
            <div className="h-0.5 w-0 bg-purple-600 group-hover:w-full transition-all duration-300" />
          </div>
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            action="#"
            method="POST"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 3,
                      message: "Full name must be at least 3 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/,
                      message: "Full name can only include letters and spaces",
                    },
                  })}
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Full Name"
                  className="block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  {...register("email", {
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
                  placeholder="example@gmail.com"
                  className="block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-900"
              >
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+?1?\d{9,12}$/,
                      message:
                        "Phone number must be in the format +XX-XXX-XXXXXXX",
                    },
                  })}
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+XX-XXX-XXXXXXX"
                  className="block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2 relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d#\u00a3@$!%*?&]{8,}$/,
                      message:
                        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
                    },
                  })}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={onChangePassword}
                  autoComplete="new-password"
                  placeholder="Must be at least 8 characters"
                  className="w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordValue &&
                    (showPassword ? (
                      <FaEye size={18} />
                    ) : (
                      <FaEyeSlash size={18} />
                    ))}
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2 absolute top-full">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center mt-14 rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                {loading ? (
              <svg className='w-10 h-5 border-4 border-purple-600 border-t-transparent rounded-full animate-spin'/>
                ):('Sign up')}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-semibold text-purple-600 hover:text-purple-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

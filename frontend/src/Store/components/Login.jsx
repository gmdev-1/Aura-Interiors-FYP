import React from 'react'
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import Spinner from './Spinner';
import { UserAuthContext } from "../context/UserAuthContext";

export default function Login() {
   const { UserVerifyAuth } = useContext(UserAuthContext);
    const {register, handleSubmit, setError, formState: { errors }, reset} = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
      };
      const onChangePassword = (event) => {
        setPasswordValue(event.target.value);
      };
      const onSubmit = async (data) => {
        if(loading) return;
        setLoading(true);

        UserLogin(data);
      }

      const UserLogin = async (data) => {
        setLoading(true);
        try{
          const response = await axios.post(
            `${BASE_URL}/user/login/`,
            data,
            { withCredentials: true}
          );
          if (response.status === 200){
            UserVerifyAuth();
            setTimeout(() => {
              navigate('/');
            }, 1000);
          }
        }
        catch(error){
          if (error.response) {
            // Handle validation errors (HTTP 400)
            if (error.response.status === 400) {
              const errors = error.response.data;
              if (errors.email) {
                setError("email", {
                  type: "server",
                  message: errors.email[0],
                });
              }
              if (errors.password) {
                setError("password", {
                  type: "server",
                  message: errors.password[0],
                });
              }
            }
            // Handle invalid credentials (HTTP 401)
            else if (error.response.status === 401) {
              setError("root", {
                type: "server",
                message: error.response.data.error || "Invalid email or password",
              });
              console.log(error.response.data.error)
            }
            // Handle server errors (HTTP 500)
            else if (error.response.status === 500) {
              setError("root", {
                type: "server",
                message:
                  error.response.data.error ||
                  "Authentication failed. Please try again later.",
              });
            } else {
              alert("An unexpected error occurred. Please try again later.");
            }
          } else {
            alert("Network error. Please try again later.");
          }
        }
        finally{
          setLoading(false);
        }
      }
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-5">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <div className="flex flex-col items-center">
        <img src="https://res.cloudinary.com/dq9ucjymr/image/upload/v1747186449/logo2_jpzebf.png" alt="" className='h-30 w-48' />
        <div className="h-0.5 w-0 bg-purple-600 group-hover:w-full transition-all duration-300"/>
      </div>
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Login to your account
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
                className="block w-full px-4 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
              />
               {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              {/* <div className="text-sm">
                <Link to="/user/forgot-password" className="font-semibold text-purple-600 hover:text-purple-500">
                  Forgot password?
                </Link>
              </div> */}
            </div>
            <div className="mt-2 relative">
              <input  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d#@£$!%*?&]{8,}$/,
                      message: "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
                    },
                  })}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={onChangePassword}
                autoComplete="current-password"
                placeholder='Must be atleast 8 characters'
                className="block w-full px-4 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm" 
              />
              <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}>
                 {passwordValue && (showPassword ? <FaEye size={18}/> : <FaEyeSlash size={18}/> )}
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-2 absolute top-full">{errors.password.message}</p>}
            </div>
          </div>

          {errors.root && (
              <div className="text-red-500 text-sm text-center mt-4">
                {errors.root.message}
              </div>
            )}

          <div>
            <button type="submit"
              className="flex w-full justify-center mt-14  rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600">
              {loading ? (
                <Spinner />
                ):('Login')}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/user/signup" className="font-semibold text-purple-600 hover:text-purple-500">
            Sign up
          </Link>
        </p>
      </div>
      </div>
    </>
  )
}

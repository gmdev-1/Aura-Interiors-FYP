import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Signin from '../../components/Signin'
import auth from '../../utils/auth'

export default function SigninPage() {  
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
    if(loading) return;
    setLoading(true);
    console.log(data);
    try {
      const response = await axios.post( "http://127.0.0.1:8000/auth/signin/",
       data,
        {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.data.access_token && response.data.refresh) {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh);
      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 300);
    }
    } catch (error) {
      if(error.response){
        console.log('Error Response:', error.response.data);
      }
      else{
        console.log('Error:', error.message);
      }
      setLoading(false);
    }
  };
  
  return (
    <>
      <Signin showPassword={showPassword} passwordValue={passwordValue} togglePasswordVisibility={togglePasswordVisibility} onChangePassword={onChangePassword} onSubmit={onSubmit} loading={loading}/>
    </>
  )
}

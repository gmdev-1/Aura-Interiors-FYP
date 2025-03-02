import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function VerifyEmail() {
    const [message, setMessage] = useState('');
    const queryParams = new URLSearchParams(useLocation().search);
    const token = queryParams.get("token");
    const user_id = queryParams.get("user_id")
    const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

    useEffect(() => {
        if (token && user_id){
            window.location.href = `${BASE_URL}/user/verify-email?user_id=${user_id}&token=${token}`
              .then(response => {
                setMessage(response.data.message || "Email Verified Successfully");
              })
              .catch(error => {
                setMessage(error.response?.data.error || "Verification failed");
            });
        }
        else{
            setMessage("Invalid Verification token")
        }
    }, [token, user_id])

    return (
    <>
    <div className='flex justify-center mt-24'>
        <h1>This is Email Verification</h1>
        <p>{message}</p>
        <p>If you are not redirected automatically, please click <a href={`${BASE_URL}/user/verify-email/?user_id=${user_id}&token=${token}`}>here</a>.</p>
    </div>
    </>
   );
};
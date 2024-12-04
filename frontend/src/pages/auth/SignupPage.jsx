import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Signup from "../../components/Signup";

export default function SignupPage() {
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
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/signup/",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data.message) {
        setTimeout(() => {
          navigate('/auth/signin')
        }, 300);
      }

      console.log("Response Data:", response.data);
    } catch (error) {
      if (error.response) {
        console.log("Error Response:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
      setLoading(false);
    }
  };
  return (
    <>
      <Signup
        showPassword={showPassword}
        passwordValue={passwordValue}
        togglePasswordVisibility={togglePasswordVisibility}
        onChangePassword={onChangePassword}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  );
}

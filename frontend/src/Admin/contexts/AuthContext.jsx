import React, { createContext, useState, useEffect, Children } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState("");
    const navigate = useNavigate();

    const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

    const VerifyAuth = async (retryCount = 0) => {
        try{
            const response = await axios.get(`${BASE_URL}/api/dashboard/admin/verify-auth/`, {
            withCredentials: true
          });
          if (response.data.user_id){
            setUserData(response.data)
            setIsAuthenticated(true);
          }
          else{
            setIsAuthenticated(false);
          }
        }
        catch(error){
          if (retryCount < 2 && (!error.response || error.response.status >= 500)) {
           await new setTimeout(() => {
             VerifyAuth(retryCount + 1)
            }, 1000 * (retryCount + 1));
          }
          if (error.response?.status === 401) {
            try{
              await axios.post(`${BASE_URL}/api/dashboard/admin/token-refresh/`, 
                {},
                { withCredentials : true}
              );
              const newResponse = await axios.get(`${BASE_URL}/api/dashboard/admin/verify-auth/`,
                { withCredentials: true}
              );
              if (newResponse.data.user_id){
                setUserData(newResponse.data);
                setIsAuthenticated(true)
                navigate('/admin/dashboard');
              }
              else{
                setIsAuthenticated(false);
              }
            }
            catch(error){
              
            }
            // Clear cookies and redirect if token is invalid
            document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            setIsAuthenticated(false);
          }
        }
        finally{
          setTimeout(() => {
            setLoading(false)
          }, 2800);
        }
      }
      
      useEffect(() => {
          VerifyAuth();
      }, []);

      
      const Logout = async () => {
        try{
          await axios.post(`${BASE_URL}/api/dashboard/admin/logout/`, {}, {
            withCredentials: true
          });
          setIsAuthenticated(false);
          navigate('/admin/login');
        }
        catch(error){
          alert(error.response?.data?.error || 'Logout Failed');
        }
      }
    
    const authContextValue = {
        userData,
        isAuthenticated,
        loading,
        VerifyAuth,
        Logout
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    )
};
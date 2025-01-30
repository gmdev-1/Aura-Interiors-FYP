const BASE_URL = import.meta.env.VITE_API_URL;
import axios from 'axios';

export const signup = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/signup/`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error(error.response?.data || error.message);
    }
};
import React, {  createContext, useState, useEffect, Children, useMemo} from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

export const CartContext = createContext({});

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;


    const CartCount = useMemo(() => {
        return cart.reduce((acc, cart) => acc + cart.quantity, 0);
    }, [cart]);

    const ListCart = async () => {
        try{
            const response = await axios.get(`${BASE_URL}/cart/`, 
                { withCredentials: true },
            );
            setCart(response.data.cart_items);
        }
        catch(error){
            console.error(error.response);
        }
    }

    const AddtoCart = async (productId, quantity = 1) => {
        try{
            const response = await axios.post(`${BASE_URL}/cart/add/`,
             { product_id: productId, quantity },
             { withCredentials: true },
            );
            ListCart();
        
            return response.data;
        }
        catch(error){
            toast.error(error);
        }
    }

    const UpdateCart = async (cartItemId, quantity) => {
        try{
            const response = await axios.put(`${BASE_URL}/cart/update/${cartItemId}/`, 
                { quantity },
                { withCredentials: true },
            );
            return response.data;
        }
        catch(error){
            console.error(error)
        }
    }

    const DeleteCart = async (cartItemId) => {
        try{
            const response = await axios.delete(`${BASE_URL}/cart/delete/${cartItemId}/`, 
                { withCredentials: true },
            );
            return response.data;
        }
        catch(error){
            console.error('cart', error);
        }
    }

    const cartContextValue = {
        cart,
        ListCart,
        AddtoCart,
        UpdateCart,
        DeleteCart,
        CartCount,
    }

    return (
        <CartContext.Provider value={cartContextValue}>
            {children}
        </CartContext.Provider>
    );
};


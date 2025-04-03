import React from "react";
import { useEffect, useState, useContext} from 'react';
import { useForm } from 'react-hook-form';
import Navbar from "../../Store/components/Navbar";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../Store/context/CartContext';
import Spinner from "../../Store/components/Spinner";
import Footer from "../../Store/components/Footer";

export default function Order(){
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { cart, ListCart } = useContext(CartContext);
     const [isSubmitting, setIsSubmitting] = useState(false);
     const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
    
    useEffect(() => {
        ListCart();
     },[]);
    
    const onSubmit = (data) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        CreateOrder(data);
    };
    
    const CreateOrder = async (data) => {
        try{
            const payload = {
                shipping_details: data,
                payment_method: "Cash on Delivery"
            };
            const response = await axios.post(`${BASE_URL}/api/order/create-order/`, payload, { withCredentials: true });
            navigate('/order/order-history');
        }
        catch(error){
            console.log(error);
        }
        setIsSubmitting(false);
    }  
    return(
        <>
        <Navbar />
        <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Side: Shipping Form */}
        <div className="w-full md:w-2/8 p-6 border border-gray-200 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Order Details</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                placeholder="Enter your phone"
                {...register("phone", { required: "Phone is required" })}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                placeholder="Enter your address"
                {...register("address", { required: "Address is required" })}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                placeholder="Enter postal code"
                {...register("postal_code", { required: "Postal code is required" })}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
              {errors.postal_code && (
                <p className="text-red-500 text-sm">{errors.postal_code.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                placeholder="Enter your city"
                {...register("city", { required: "City is required" })}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-full hover:from-purple-700 hover:to-purple-800"
            >
              { isSubmitting ? <Spinner /> : "Place Order" }
            </button>
          </form>
        </div>

        {/* Right Side: Cart Items */}
        <div className="w-full md:w-1/2 p-6 border border-gray-200 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
          {cart && cart.length > 0 ? (
           cart.map((cart) => (
            <div key={cart.id} className="flex items-center mb-4">
              <img
                src={cart.image}
                alt={cart.product_name}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-medium">{cart.product_name}</h3>
                <p className="text-gray-600">Quantity: {cart.quantity}</p>
              </div>
              <p className="text-gray-800 font-semibold">${cart.price}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No products in your cart.
          </div>
        )}
         <div className="mt-6 border-t pt-4">
            </div>
            <p className="text-xl font-bold">
                Total: $
                {(
                cart.reduce((total, item) => total + (item.price - item.discount) * item.quantity, 0)).toFixed(2)}
            </p>
            </div>
        </div>
      </div>
      <Footer />
    </>
    );
};

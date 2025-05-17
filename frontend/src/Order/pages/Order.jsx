import React from "react";
import { useEffect, useState, useContext} from 'react';
import { useForm } from 'react-hook-form';
import Navbar from "../../Store/components/Navbar";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../Store/context/CartContext';
import Spinner from "../../Store/components/Spinner";
import Footer from "../../Store/components/Footer";
import { FaStripe } from "react-icons/fa";
// import { loadStripe } from "@stripe/stripe-js";
import ReactGA from "react-ga4";

export default function Order(){
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { cart, ListCart } = useContext(CartContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL; 
    // const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY);
    
    useEffect(() => {
        ListCart();

      ReactGA.event('purchase', {
      transaction_id: 'T' + new Date().getTime(), // replace with actual order ID if available
      affiliation: 'Aura Interiors Online Store',
      currency: 'USD',
      value: cart.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0),
      tax: 0,
      shipping: shipping,
      items: cart.map(item => ({
        item_id: item.id,
        item_name: item.product_name,
        quantity: item.quantity,
        price: item.price - item.discount,
      })),
    });
     },[]);
    
    const onSubmit = async (data) => {
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
    
     const subTotal = cart.reduce(
    (sum, cart) => sum + (cart.price) * cart.quantity, 0);

     const totalDiscount = cart.reduce(
    (sum, item) => sum + item.discount * item.quantity,
    0
  );

    const shipping = 20;
    const  total = subTotal - totalDiscount + shipping;;
    
    return(
        <>
        <Navbar />
      <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/8 p-6 border border-gray-200 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Order Details</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("name", {
                          required: "Name is required",
                          minLength: { value: 3, message: "Name must be at least 3 characters" },
                          maxLength: { value: 50, message: "Name cannot be greater then 50 characters" },
                          pattern: {
                            value: /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/,
                            message: "Name can only include letters and spaces",
                          },
                        })}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"/>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email address",
                          },
                        })}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="tel"
                min={13}
                placeholder="924729282910"
                {...register("phone", {
                          required: "Phone is required",
                           pattern: {
                          value: /^\d{10,12}$/,
                          message: 'Phone number must be between 10 and 15 digits'
                        }
                          
                        })}
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
                {...register("address", {
                        required: "Address is required",
                          minLength: { value: 10, message: 'Address must be at least 10 characters' },
                          maxLength: { value: 250, message: 'Address must be at most 250 characters' }
                        })}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="number"
                min={6}
                
                placeholder="Enter postal code"
                {...register("postal_code", {
                          required: "Postal code is required",
                          pattern: {
                          value: /^\d{5,6}$/,
                          message: 'Postal code must be 5 or 6 digits'
                        }
                        })}
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
                {...register("city", {
                          required: "City is required",
                          minLength: { value: 3, message: 'City must be at least 3 characters' },
                          maxLength: { value: 50, message: 'City must be at most 50 characters' },
                          pattern: {
                            value: /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/,
                            message: 'City can only include letters and spaces'
                          }
                        })}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
            <div className="mb-4">
            <label className="block text-gray-700">Payment Method</label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="cod"
                  {...register('paymentMethod', { required: 'Please select payment method' })}
                />
                <span>Cash on Delivery</span>
              </label>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>
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
           <div className="flex justify-between">
                  <span className="text-base text-gray-700">Subtotal</span>
                  <span className="text-base text-gray-700">
                    {cart && `$${subTotal.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between mt-1">
                  <span className="text-base text-gray-700">Total Discount</span>
                  <span className="text-base text-gray-700">
                    {cart && `-$${totalDiscount.toFixed(2)}`}
                  </span>
                </div>
 
                <div className="flex justify-between mt-1">
                  <span className="text-base text-gray-700">Shipping Fee</span>
                  <span className="text-base text-gray-700">
                    {cart && `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                
                <hr className="border-gray-300 mt-2" />
                <div className="flex justify-between font-semibold text-xl text-gray-800 mt-2">
                  <span>Total</span>
                  <span>{cart && `$${total.toFixed(2)}`}</span>
                </div>
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
    );
};

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Dashboard from "./Dashboard";

export default function OrdersDetail() {
    const [order, setOrder] = useState([]);
    const { order_id } = useParams();
    const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

    const OrderDetails = async () => {
        try{
            const response = await axios.get(`${BASE_URL}/api/order/order-detail-admin/${order_id}/`,{ withCredentials: true });
            setOrder(response.data.order);
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        OrderDetails();
    }, []);

    return(
        <>
          <Dashboard>
      <div className="max-w-4xl mx-auto p-6 my-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Order Details</h1>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Order ID:</span> { order.order_id ? order.order_id.slice(5, 12) : order._id }
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Order Status:</span>{" "}
            {order.order_status || "N/A"}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Payment Method:</span>{" "}
            {order.payment_method || "N/A"}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Payment Status:</span>{" "}
            {order.payment_status || "N/A"}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Total:</span> ${order.total || "0.00"}
          </p>

          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Shipping Details</h2>
            <p className="text-gray-600">
              <span className="font-semibold">Name:</span>{" "}
              {order.shipping_details?.name || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span>{" "}
              {order.shipping_details?.email || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Phone:</span>{" "}
              {order.shipping_details?.phone || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Address:</span>{" "}
              {order.shipping_details?.address || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">City:</span>{" "}
              {order.shipping_details?.city || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Postal Code:</span>{" "}
              {order.shipping_details?.postal_code || "N/A"}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Items</h2>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} className="flex items-center border-b pb-2 mb-2">
                  <img
                    src={item.image}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <p className="text-gray-800 font-semibold">{item.product_name}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Price: ${item.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No items found.</p>
            )}
          </div>

          <div className="mt-4">
            <p className="text-gray-500 text-sm">
              Order Placed at: {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      </Dashboard>
        </>
    );
};
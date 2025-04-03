import React, { useEffect, useState } from "react";
import Navbar from "../../Store/components/Navbar";
import axios from "axios";
import Footer from "../../Store/components/Footer";
import { AiFillEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";


export default function OrderHistory() {
    const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const OrderList = async () => {
      try{
        const response = await axios.get(`${BASE_URL}/api/order/order-list/`, { withCredentials: true });
        setOrders(response.data.orders);
      }
      catch(error){
        console.log(error);
      }
    }

    useEffect(() => {
      OrderList();
    }, []);

    const OrderDetail = async (order_id) => {
      navigate(`/order/order-detail/${order_id}`);
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-6">
                <h2 className="text-2xl font-semibold mb-4">Order History</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="py-3 px-6 text-left">Order ID</th>
                                <th className="py-3 px-6 text-left">Date</th>
                                <th className="py-3 px-6 text-left">Total</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-left">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-6">{order.order_id.slice(5, 12)}</td>
                                    <td className="py-3 px-6">{order.created_at.slice(0, 10)}</td>
                                    <td className="py-3 px-6">{order.total}</td>
                                    <td className={`py-3 px-6 font-semibold ${
                                      order.order_status === "Delivered" ? "text-green-600" : 
                                      order.order_status === "Shipped" ? "text-blue-600" : "text-yellow-600"
                                    }`}>
                                        {order.order_status}
                                    </td>
                                    <td className="py-3 px-6 cursor-pointer"><AiFillEye size={20} onClick={()=> OrderDetail(order.order_id)}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          <Footer />
        </>
    );
}

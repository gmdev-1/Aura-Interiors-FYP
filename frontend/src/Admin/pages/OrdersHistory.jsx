import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import axios from "axios";
import { AiFillEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function OrdersHistory() {
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const OrderList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/order/order-list-admin/`, {
        withCredentials: true,
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    OrderList();
  }, [BASE_URL]);

  const OrderDetail = async (order_id) => {
    navigate(`/admin/dashboard/orders/order-detail/${order_id}`);
  };

      const handleOrderStatusChange = async (order_id, newStatus) => {
        try {
          await axios.patch(
            `${BASE_URL}/api/order/update-status/${order_id}/`,
            { order_status: newStatus },
            { withCredentials: true }
          );
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.order_id === order_id ? { ...order, order_status: newStatus } : order
            )
          );
        } catch (error) {
          console.error("Failed to update order status", error);
        }
      };
    
      // Update payment status
      const handlePaymentStatusChange = async (order_id, newPaymentStatus) => {
        try {
          await axios.patch(
            `${BASE_URL}/api/order/update-payment/${order_id}/`,
            { payment_status: newPaymentStatus },
            { withCredentials: true }
          );
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.order_id === order_id ? { ...order, payment_status: newPaymentStatus } : order
            )
          );
        } catch (error) {
          console.error("Failed to update payment status", error);
        }
      };
    
      const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
      const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

  return (
    <>
      <Dashboard>
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4 mt-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-700">Orders</h1>
          </div>
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-6 text-left">#</th>
                <th className="py-3 px-6 text-left">Order ID</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Total</th>
                <th className="py-3 px-6 text-left">Order Status</th>
                <th className="py-3 px-6 text-left">Payment Status</th>
                <th className="py-3 px-6 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{index+1}</td>
                  <td className="py-3 px-6">{order.order_id.slice(5, 12)}</td>
                  <td className="py-3 px-6">{order.created_at.slice(0, 10)}</td>
                  <td className="py-3 px-6">{order.total}</td>
                  <td className="py-3 px-6 border">
                  <select
                    className="py-2 px-4 border rounded"
                    value={order.order_status}
                    onChange={(e) => handleOrderStatusChange(order.order_id, e.target.value)}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-6 border">
                  <select
                    className="py-2 px-4 border rounded"
                    value={order.payment_status}
                    onChange={(e) => handlePaymentStatusChange(order.order_id, e.target.value)}
                  >
                    {PAYMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                  <td className="py-3 px-6 cursor-pointer">
                    <button onClick={() => OrderDetail(order.order_id)} className="flex bg-purple-600 text-white px-2 py-1 rounded-2xl">
                    <AiFillEye
                      size={20} className="mt-0.5 mr-1"/>
                      Details
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Dashboard>
    </>
  );
}

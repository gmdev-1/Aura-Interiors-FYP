import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import Spinner from './Spinner';

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/dashboard/analytics-data/`,
        { withCredentials: true }
      );
      // Convert date strings like "20250508" to a more readable format
      const formatted = data.map(d => ({
        ...d,
        date: `${d.date.slice(4,6)}/${d.date.slice(6,8)}` // "MM/DD"
      }));
      setData(formatted);
    } catch (e) {
      console.error('Analytics fetch error', e);
    }
    finally {
      setLoading(false);
    }
  };

   if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  // Summary calculations
  const totalActiveUsers = data.reduce((sum, d) => sum + d.activeUsers, 0);
  const totalPageViews = data.reduce((sum, d) => sum + d.screenPageViews, 0);
  const totalEvents = data.reduce((sum, d) => sum + d.eventCount, 0);
  const totalRevenue = data.reduce((sum, d) => sum + d.purchaseRevenue, 0);

  return (
    <div className="p-6 bg-gray-100 rounded shadow space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase">Active Users</h2>
          <p className="text-2xl font-bold text-gray-800">{totalActiveUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase">Page Views</h2>
          <p className="text-2xl font-bold text-gray-800">{totalPageViews}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase">Events</h2>
          <p className="text-2xl font-bold text-gray-800">{totalEvents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase">Revenue</h2>
          <p className="text-2xl font-bold text-gray-800">${totalRevenue}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Active Users & Events */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Users & Events (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="activeUsers"
                name="Active Users"
                stroke="#82ca9d"
                fillOpacity={0.3}
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey="eventCount"
                name="Event Count"
                stroke="#8884d8"
                fillOpacity={0.3}
                fill="#8884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Page Views & Engagement Rate */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Page Views & Engagement Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={val => `${val}%`}
              />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="screenPageViews"
                name="Page Views"
                stroke="#ffc658"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="engagementRate"
                name="Engagement Rate"
                stroke="#ff7300"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 3. E-Commerce Metrics */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">E-Commerce Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="addToCarts" name="Add to Carts" fill="#8884d8" />
              <Bar dataKey="checkouts" name="Checkouts" fill="#82ca9d" />
              <Bar dataKey="ecommercePurchases" name="Purchases" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Revenue Over Time */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Revenue Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={val => `$${val}`} />
              <Tooltip formatter={val => `$${val}`} />
              <Line
                type="monotone"
                dataKey="purchaseRevenue"
                name="Purchase Revenue"
                stroke="#8884d8"
              />
              <Line
                type="monotone"
                dataKey="totalRevenue"
                name="Total Revenue"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

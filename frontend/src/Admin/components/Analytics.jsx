import React from 'react'

export default function Analytics() {
  return (
    <>
      <div className="flex-1 p-6 bg-gray-100 rounded-xs shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-black">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">Total Visitors</h2>
          <p className="text-2xl font-bold text-gray-800">24,350</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">Total Sales</h2>
          <p className="text-2xl font-bold text-gray-800">$123,450</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">Orders</h2>
          <p className="text-2xl font-bold text-gray-800">1,234</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">Conversion Rate</h2>
          <p className="text-2xl font-bold text-gray-800">4.7%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Sales Trends</h2>
          <div className="h-64">
            {/* <img src="https://res.cloudinary.com/dctgk7mh7/image/upload/v1739017887/carousals/v1slla2por9dbgbyoe6e.jpg" alt="Sales Trends Chart" className="w-full h-full object-cover" /> */}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Top Performing Products</h2>
          <div className="h-64">
            {/* <img src="https://res.cloudinary.com/dctgk7mh7/image/upload/v1739018098/carousals/jagfmb4gdok0sf0yojd2.jpg" alt="Top Products Chart" className="w-full h-full object-cover" /> */}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Orders</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="p-4 text-sm text-gray-800">#1001</td>
              <td className="p-4 text-sm text-gray-800">John Doe</td>
              <td className="p-4 text-sm text-gray-800">$250</td>
              <td className="p-4 text-sm text-gray-800">2024-12-09</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="p-4 text-sm text-gray-800">#1002</td>
              <td className="p-4 text-sm text-gray-800">Jane Smith</td>
              <td className="p-4 text-sm text-gray-800">$450</td>
              <td className="p-4 text-sm text-gray-800">2024-12-08</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}

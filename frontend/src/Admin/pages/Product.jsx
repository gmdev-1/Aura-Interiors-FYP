import React from 'react'
import Dashboard from './Dashboard';
import { AiFillDelete } from "react-icons/ai";
import { AiFillEdit, AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function Product() {
  return (
    <>
    <Dashboard >
    <div className="flex flex-col">
  <div className="flex items-center justify-between mb-4 mt-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-700">Product</h1>
            <Link to="/admin/dashboard-unique/add-product"
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out"
            >
              <AiOutlinePlus className="mr-2 text-lg" />
              Add Product
            </Link>
          </div>
  <div className="overflow-x-auto shadow-lg rounded-lg">
    <div className="min-w-full align-middle">
      <div className="overflow-hidden border border-gray-300 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Product Name
              </th>
              <th
                scope="col"
                className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Image
              </th>
              <th
                scope="col"
                className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                SKU
              </th>
              <th
                scope="col"
                className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Sub Category
              </th>
              <th
                scope="col"
                className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Stock Quantity
              </th>
              <th
                scope="col"
                className="p-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr className="hover:bg-gray-50">
              <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                Louis Vuitton
              </td>
              <td className="p-4 whitespace-nowrap text-sm text-gray-800">
                20010510
              </td>
              <td className="p-4 whitespace-nowrap text-sm text-gray-800">
                Customer
              </td>
              <td className="p-4 whitespace-nowrap text-sm text-gray-800">
                Accessories
              </td>
              <td className="p-4 whitespace-nowrap text-sm text-gray-800">
                Accessories
              </td>
              <td className="p-4 whitespace-nowrap text-sm text-gray-800">
                Accessories
              </td>
              <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                              category.is_active === 'true' || category.is_active === true
                                ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                                : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                            }`}
                          >
                            {category.is_active === 'true' || category.is_active === true ? 'Active' : 'Inactive'}

                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                              category.is_featured === 'true' || category.is_featured === true
                                ? 'bg-green-50 text-purple-700 ring-1 ring-inset ring-green-600/20'
                                : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                            }`}
                          >
                            {category.is_featured === 'true' || category.is_featured === true ? 'Yes' : 'No'}

                          </span>
                        </td>
              <td className="p-4 whitespace-nowrap text-center text-sm">
                <button className="inline-flex items-center mr-1 bg-blue-500 rounded-md text-white hover:bg-blue-600 px-2 py-1">
                  <AiFillEdit size={20} />
                  <span className="ml-1">Edit</span>
                </button>
                <button className="inline-flex items-center ml-1 bg-red-500 text-white rounded-md hover:bg-red-600 px-2 py-1">
                  <AiFillDelete  size={20} />
                  <span className="ml-1">Delete</span>
                </button>
              </td> 
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

    </Dashboard>
    </>
  )
}

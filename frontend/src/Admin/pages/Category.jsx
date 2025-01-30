import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiDeleteBin6Fill  } from "react-icons/ri";
import { AiFillEdit, AiOutlinePlus } from "react-icons/ai";
import { Link, replace, useNavigate } from 'react-router';
import Dashboard from './Dashboard';

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const BASE_URL = "http://localhost:8000";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/get-categories/`);
      setCategories(response.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };


  const DeleteCategory = async (categoryId) => {
     const isConfirmed = window. confirm("Are you sure you want to delete this category?");
      if (!isConfirmed) {
        return; 
      }
      const originalCategories = [...categories];
      setCategories((prevCategories) => 
        prevCategories.filter((category) => category.id !== categoryId)
      );
    try {
      const response = await axios.delete(`${BASE_URL}/api/dashboard/delete-category/${categoryId}/`)
      alert('Successfully Deleted');
      
    } 
    catch (error) {
      setCategories(originalCategories);
      console.error(error);
    }
  }

  const navigate = useNavigate()
  const EditCategory = (categoryId) => {
    navigate(`/admin/dashboard/edit-category/${categoryId}`);
  }

  return (
    <>
      <Dashboard >
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4 mt-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">Category</h1>
          <Link to="/admin/dashboard/add-category"
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out"
          >
            <AiOutlinePlus className="mr-2 text-lg" />
            Add Category
          </Link>
        </div>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <div className="min-w-full align-middle">
            <div className="overflow-hidden border border-gray-300 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Category Description
                    </th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="p-4 text-center">
                       <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        Loading categories...
                        </svg>
                      </td>
                    </tr>
                  ) : categories.length > 0 ? (
                    categories.map((category, index) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                          {index+1}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                          {category.image ? (
                            <img
                              src={`${BASE_URL}${category.image?.replace(/\\/g, '/')}`} 
                              alt={category.name}
                              className="w-16 h-16 rounded-full"
                            />
                          ) : (
                            'No Image'
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                          {category.name}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                          {category.description}
                        </td>
                        <td className="p-4 whitespace-nowrap text-center text-sm">
                          <button onClick={() => EditCategory(category.id)} className="inline-flex items-center mr-1 bg-blue-500 rounded-md text-white hover:bg-blue-600 px-2 py-1">
                            <AiFillEdit size={20} />
                            <span className="ml-1">Edit</span>
                          </button>
                          <button onClick={()=> DeleteCategory(category.id)} className="inline-flex items-center ml-1 bg-red-500 text-white rounded-md hover:bg-red-600 px-2 py-1">
                            <RiDeleteBin6Fill  size={20} />
                            <span className="ml-1">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-4 text-center">
                        No categories found.
                      </td>
                    </tr>
                  )}
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

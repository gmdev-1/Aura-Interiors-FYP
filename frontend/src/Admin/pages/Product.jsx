import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import { RiDeleteBin6Fill  } from "react-icons/ri";
import { AiFillEdit, AiOutlinePlus } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Spinner from '../components/Spinner';

export default function Product() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

    useEffect(() => {
      fetchProducts();
    }, []);
  
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/dashboard/get-products/`);
        setProducts(response.data);
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    const DeleteProduct = async (productId) => {
      const isConfirmed = window. confirm("Are you sure you want to delete this product?");
       if (!isConfirmed) {
         return; 
       }
       const originalProducts = [...products];
       setProducts((prevProducts) => 
         prevProducts.filter((product) => product.id !== productId)
       );
     try {
       const response = await axios.delete(`${BASE_URL}/api/dashboard/delete-product/${productId}/`)
       alert('Successfully Deleted');
      } 
     catch (error) {
       setProducts(originalProducts);
       console.error(error);
     }
   }

     const navigate = useNavigate()
     const EditProduct = (productId) => {
       navigate(`/admin/dashboard/edit-product/${productId}`);
     }

  //  Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Function to change pages
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
  <Dashboard >
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4 mt-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-700">Product</h1>
              {loading && <Spinner /> }
            <Link to="/admin/dashboard/add-product"
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
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  #
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Image
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Product Name
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Category
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Price
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Stock Quantity
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Rating
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Is Featured
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
                      Loading products...
                  </svg>
                </td>
              </tr>
              ) : currentProducts.length > 0 ? (
                currentProducts.map((product, index) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    <img
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 rounded-full"/>
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    {product.name}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    {product.category}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    <span className='text-purple-700'>$</span>{product.price}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    {product.quantity}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    {product.rating}
                </td>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                              product.is_featured === 'true' || product.is_featured === true
                                ? 'bg-green-50 text-purple-700 ring-1 ring-inset ring-green-600/20'
                                : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                            }`}
                          >
                            {product.is_featured === 'true' || product.is_featured === true ? 'Yes' : 'No'}

                          </span>
                        </td>
              <td className="p-4 whitespace-nowrap text-center text-sm">
                <button onClick={() => EditProduct(product.id)} className="inline-flex items-center mr-1 bg-blue-500 rounded-md text-white hover:bg-blue-600 px-2 py-1">
                  <AiFillEdit size={20} />
                  <span className="ml-1">Edit</span>
                </button>
                <button onClick={()=> DeleteProduct(product.id)} className="inline-flex items-center ml-1 bg-red-500 text-white rounded-md hover:bg-red-600 px-2 py-1">
                  <RiDeleteBin6Fill  size={20} />
                  <span className="ml-1">Delete</span>
                </button>
              </td> 
            </tr>
                ))
            ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center">
                    No products found.
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    
  </div>
</div>
          {/* Pagination Controls */}
          {products.length > itemsPerPage && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-l-md"
              >
                Previous
              </button>
              <div className="px-4 py-2 border-t border-b">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-r-md"
              >
                Next
              </button>
            </div>
          )}

    </Dashboard>
    </>
  )
}

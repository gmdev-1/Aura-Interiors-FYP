import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Carousal from "../components/HomeCarousal";
import Footer from "../components/Footer";
import { AiFillStar } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import Spinner from '../../Admin/components/Spinner';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { useContext } from 'react';

export default function Shop() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { AddtoCart } = useContext(CartContext);
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const { category } = useParams();
  const [filter, setFilter] = useState({
    category: [],
    featured: false,
    priceRange: [],
    material: [],
    color: []
  });
  

   useEffect(() => {
      fetchProducts();
      setCurrentPage(1);
    }, [filter]);

   useEffect(() => {
      getCategories();
    }, []);

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
    
        // Append query parameters only if they have values.
        if (filter.category.length > 0)
          queryParams.append('category', filter.category.join(','));
        if (filter.featured)
          queryParams.append('featured', filter.featured);
        if (filter.priceRange.length > 0)
          queryParams.append('priceRange', filter.priceRange.join(','));
        if (filter.material.length > 0)
          queryParams.append('material', filter.material.join(','));
        if (filter.color.length > 0)
          queryParams.append('color', filter.color.join(','));
    
        // Decide which endpoint to use:
        // If any filter is active, use the filtered endpoint.
        const hasFilter =
          filter.featured ||
          filter.category.length > 0 ||
          filter.priceRange.length > 0 ||
          filter.material.length > 0 ||
          filter.color.length > 0;
    
        const url = hasFilter
          ? `${BASE_URL}/products-shop/filter/?${queryParams.toString()}`
          : `${BASE_URL}/products-shop/`;
    
        const response = await axios.get(url);
        setProducts(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        alert('Error fetching products');
        setLoading(false);
      }
    };

    const handleFilterChange = (e) => {
      const { name, value, checked } = e.target;
      setFilter((prevFilters) => {
        const updated = { ...prevFilters };
        if (name === 'featured') {
          // For a boolean filter
          updated.featured = checked;
        } else {
          // For filters that allow multiple selections (arrays)
          if (checked) {
            updated[name] = [...updated[name], value];
            
          } else {
            updated[name] = updated[name].filter((item) => item !== value);
            
          }
        }
        return updated;
      });
    };

    const getCategories = async () => {
      const response = await axios.get(`${BASE_URL}/categories-filter/`);
      setCategories(response.data);
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
 
  const handleAddToCart = async (productId) => {
    try{
      await AddtoCart(productId, 1)
    }
    catch(error){
      console.error(error);
    }
  }

  // Shared filter content
  const FilterContent = (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Filters</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Category</h3>
        <div className="flex flex-col space-y-1">
          {categories.map((category) => (

          <label key={category.id} className="inline-flex items-center">
            <input type="checkbox" name='category' value={category.id} className="form-checkbox" onChange={handleFilterChange}  />
            <span className="ml-2">{category.name}</span>
          </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Featured product</h3>
        <div className="flex flex-col space-y-1">
          <label className="inline-flex items-center">
            <input type="checkbox" name="featured" className="form-checkbox" onChange={handleFilterChange}  />
            <span className="ml-2">Featured</span>
          </label>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Price Range</h3>
        <div className="flex flex-col space-y-1">
        {["Under $25", "$25 - $50", "$50 - $100", "$100 - $200", "Above $200"].map((price) => (
          <label key={price} className="inline-flex items-center">
            <input type="checkbox" value={price} name="priceRange"  className="form-checkbox" onChange={handleFilterChange}  />
            <span className="ml-2">{price}</span>
          </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Material</h3>
        <div className="flex flex-col space-y-1">
        {["wood", "ceramic", "steel"].map((material) => (
          <label key={material} className="inline-flex items-center">
            <input value={material} type="checkbox" name="material" className="form-checkbox" onChange={handleFilterChange}  />
            <span className="ml-2">{material}</span>
          </label>
             ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Color</h3>
        <div className="flex flex-col space-y-1">
        {["black", "green", "brown"].map((color) => (
          <label  key={color} className="inline-flex items-center">
            <input value={color} type="checkbox" name="color" className="form-checkbox"  onChange={handleFilterChange} />
            <span className="ml-2">{color}</span>
          </label>
        ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <Carousal category={category} />

      <section className="py-8 px-4 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Filter Drawer */}
          <div className="md:hidden">
            <div
              className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
                isFilterOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <button
                onClick={() => setIsFilterOpen(false)}
                className="absolute size-10 font-extrabold top-4 right-4 text-gray-600"
              >
                X
              </button>
              <div className="p-6">{FilterContent}</div>
            </div>
            {isFilterOpen && (
              <div
                className="fixed inset-0 bg-black opacity-50 z-40"
                onClick={() => setIsFilterOpen(false)}
              ></div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Desktop Filter Sidebar */}
            <div className="hidden md:block md:w-1/4">
              <div className="bg-white rounded-lg shadow p-6">{FilterContent}</div>
            </div>

            {/* Product Listings */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Products</h2>
                {/* Toggle button for mobile */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="md:hidden bg-purple-500 text-white px-4 py-2 rounded-md"
                >
                  Filters
                </button>
              </div>
              {currentProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2">
                {currentProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow overflow-hidden transform transition duration-300"
                  >
                    <Link to={`/product-detail/${encodeURIComponent(product.name)}`}>
                    {(product.is_featured === "true" || product.is_featured === true) &&(
                      <div className="absolute top-2 left-2 z-10 bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
                     {(product.is_featured === 'true' || product.is_featured === true) && 'Featured'}
                    </div>)}
                    <div className='flex justify-center items-center h-52'>
                    {loading ? <Spinner /> :
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-contain"
                    /> }
                    </div>
                    </Link>

                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-purple-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="mt-2">
                        <span className="text-sm flex items-center">
                          <AiFillStar className="text-yellow-400 mr-1" />
                          <span className="text-yellow-900 font-medium">
                            {product.rating}
                          </span>
                          <span className="ml-2 text-purple-600 font-semibold text-xs bg-purple-50 rounded-xl p-1">
                            ({product.review}) Reviews
                          </span>
                        </span>
                      </div>
                      <div className="mt-4">
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                          ${(product.price)}{" "}
                          {Number(product.discount) > 0 && (
                            <span className="text-purple-600 text-sm ml-3">${product.discount} OFF</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="px-4 pb-3">
                      <button onClick={() => handleAddToCart(product.id)} className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm rounded-full hover:from-purple-700 hover:to-purple-800">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="text-center text-gray-500">
                  No products found matching your filters.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex justify-center'>
          {products.length > itemsPerPage && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-l-md bg-white"
                >
                Previous
              </button>
              <div className="px-4 py-2 border-t border-b bg-white">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-r-md bg-white"
                >
                Next
              </button>
            </div>
          )}
          </div>
      </section>
      <Footer />
    </>
  );
}

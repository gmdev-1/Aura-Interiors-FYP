import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router';
import Spinner from '../components/Spinner';

export default function AddProduct() {
  const { register, handleSubmit, setError, formState: { errors }, reset} = useForm();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [existingImage, setExistingImage] = useState(null);
  const { productId } = useParams();
  const isEditMode = Boolean(productId);
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/get-categories/`);
      setCategories(response.data);

    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const onSubmit = (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    isEditMode ? editProduct(data) : addProduct(data);
  };

  const addProduct = async (data) => {
    try {
      const token = localStorage.getItem('token'); // Make sure to get the token
      const formData = new FormData();
      formData.append('name', data.productName);
      formData.append('description', data.productDescription);
      formData.append('category', data.category);
      formData.append('price', data.price);
      formData.append('discount', data.discountPrice);
      formData.append('quantity', data.stockQuantity);
      formData.append('color', data.colors);
      formData.append('size', data.sizes);
      formData.append('material', data.material);
      formData.append('rating', data.ratings);
      formData.append('review', data.reviews);
      formData.append('is_featured', data.featuredProduct);
      if(data.productImage && data.productImage[0]){
        formData.append('image', data.productImage[0]);
      }

      const response = await axios.post(
        `${BASE_URL}/api/dashboard/add-product/`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // 'Authorization': `Bearer ${token}` 
          }
        }
      );
      navigate('/admin/dashboard/products');
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        // Map backend field names to your react-hook-form field names
        const fieldMapping = {
          name: 'productName',
          description: 'productDescription',
          image: 'categoryImage',
          price: 'price',
          category: 'category',
          quantity: 'stockQuantity',
          review: 'reviews',
          rating: 'ratings',
          is_featured: 'featuredProduct',
          color: 'colors',
          material: 'material',
          size: 'sizes',
          discount: 'discountPrice',
        };
      
        Object.entries(backendErrors).forEach(([key, messages]) => {
          // Use the mapped key if available, otherwise default to the original key.
          const formField = fieldMapping[key] || key;
          setError(formField, {
            type: 'server',
            message: messages[0],
          });
        });
      }
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/dashboard/get-product/${productId}/`);
          const productData = response.data[0];
          reset({
            productName: productData.name,
            productDescription: productData.description,
            category: productData.category,
            price: productData.price,
            discountPrice: productData.discount,
            stockQuantity: productData.quantity,
            colors: productData.color,
            sizes: productData.size,
            material: productData.material,
            ratings: productData.rating,
            reviews: productData.review,
            featuredProduct: productData.is_featured,
          });
          setExistingImage(productData.image);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };
      fetchProduct();
    }
  }, [productId, isEditMode]);

  const editProduct = async (data) => {
    try {
      // const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', data.productName);
      formData.append('description', data.productDescription);
      formData.append('category', data.category);
      formData.append('price', data.price);
      formData.append('discount', data.discountPrice);
      formData.append('quantity', data.stockQuantity);
      formData.append('color', data.colors);
      formData.append('size', data.sizes);
      formData.append('material', data.material);
      formData.append('rating', data.ratings);
      formData.append('review', data.reviews);
      formData.append('is_featured', data.featuredProduct);
      
      // Append new image if exists, else keep existing
      if(data.productImage && data.productImage[0]){
        formData.append('image', data.productImage[0]);
      }

      await axios.put(
        `${BASE_URL}/api/dashboard/edit-product/${productId}/`, 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      navigate('/admin/dashboard/products');
    } catch (error) {
      console.error(error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <>
     <Dashboard >
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>

      <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
        <div className="mb-4">
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            {...register('productName', { required: 'Product name is required' })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter product name"
          />
           {errors.productName && <p className="text-red-500 text-sm">{errors.productName.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            rows="4"
            {...register('productDescription', { required: 'Description is required' })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter product description"
          ></textarea>
          {errors.productDescription && <p className="text-red-500 text-sm">{errors.productDescription.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            {...register('category', { required: 'Category is required' })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            min={0}
            id="price"
            name="price"
            {...register('price', { required: 'Price is required' })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter price"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700">
            Discount Price (Optional)
          </label>
          <input
            type="number"
            min={0}
            id="discountPrice"
            name="discountPrice"
            {...register('discountPrice')}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter discount price"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
            Stock Quantity
          </label>
          <input
            type="number"
            min={0}
            id="stockQuantity"
            name="stockQuantity"
            {...register('stockQuantity', { required: 'Stock quantity is required' })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter stock quantity"
          />
          {errors.stockQuantity && <p className="text-red-500 text-sm">{errors.stockQuantity.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="productImage" className="block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <input
            type="file"
            id="productImage"
            name="productImage"
            {...register('productImage', { required: !isEditMode && 'Image is required' })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
            {existingImage && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Current Image: </span>
                  <img 
                    src={existingImage} 
                    alt="Current category" 
                    className="w-16 h-16 mt-1 rounded-full"
                  />
                </div>
              )}
          {errors.productImage && <p className="text-red-500 text-sm">{errors.productImage.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="colors" className="block text-sm font-medium text-gray-700">
            Colors
          </label>
          <input
            type="text"
            id="colors"
            name="colors"
            {...register('colors', { required: 'Color is required' })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter colors (comma-separated)"
          />
          {errors.colors && <p className="text-red-500 text-sm">{errors.colors.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">
            Sizes
          </label>
          <input
            type="text"
            id="sizes"
            name="sizes"
            {...register('sizes', { required: 'Size is required' })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter sizes (comma-separated)"
          />
          {errors.sizes && <p className="text-red-500 text-sm">{errors.sizes.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="material" className="block text-sm font-medium text-gray-700">
            Material
          </label>
          <input
            type="text"
            id="material"
            name="material"
            {...register('material', { required: 'Material is required' })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter material"
          />
          {errors.material && <p className="text-red-500 text-sm">{errors.material.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="ratings" className="block text-sm font-medium text-gray-700">
            Ratings
          </label>
          <input
            type="number"
            step="0.1"
            min={0}
            max={5}
            id="ratings"
            name="ratings"
            {...register('ratings', { required: 'Rating is required', min: 0, max: 5 })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter ratings (0-5)"
          />
          {errors.ratings && <p className="text-red-500 text-sm">{errors.ratings.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="reviews" className="block text-sm font-medium text-gray-700">
            Reviews
          </label>
          <input
            type="number"
            min={0}
            id="reviews"
            name="reviews"
            {...register('reviews', { required: 'Review is required' })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter reviews"
          />
          {errors.reviews && <p className="text-red-500 text-sm">{errors.reviews.message}</p>}
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="featuredProduct"
            name="featuredProduct"
            {...register('featuredProduct')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="featuredProduct" className="ml-2 text-sm font-medium text-gray-700">
            Featured Product
          </label>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full flex justify-center items-center bg-purple-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : (isEditMode ? 'Update Product' : 'Add Product')}
          </button>
        </div>
      </form>
    </div>
    </Dashboard>
    </>
  )
}

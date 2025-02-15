import React from 'react'
import Dashboard from './Dashboard';
import Spinner from '../components/Spinner';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';

export default function AddCategory() {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImage, setExistingImage] = useState(null);
  const { categoryId } = useParams();
  const isEditMode = Boolean(categoryId);
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  const onSubmit = (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    isEditMode ? editCategory(data) : addCategory(data);
  };

  const addCategory = async (data) => {
    try {
      const token = localStorage.getItem('token'); // Make sure to get the token
      const formData = new FormData();
      formData.append('name', data.categoryName);
      formData.append('description', data.categoryDescription);
      if(data.categoryImage && data.categoryImage[0]){
        formData.append('image', data.categoryImage[0]);
      }

      const response = await axios.post(
        `${BASE_URL}/api/dashboard/add-category/`, 
        formData, 
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            // 'Authorization': `Bearer ${token}` 
          }
        }
      );
      navigate('/admin/dashboard/categories');
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        if (backendErrors.name) {
          setError('categoryName', {
            type: 'server',
            message: backendErrors.name[0],
          });
        }
        if (backendErrors.description) {
          setError('categoryDescription', {
            type: 'server',
            message: backendErrors.description[0],
          });
        }
        if (backendErrors.image) {
          setError('categoryImage', {
            type: 'server',
            message: backendErrors.image[0],
          });
        }
      }
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/dashboard/get-category/${categoryId}/`,
            { withCredentials: true }
          );
          const categoryData = response.data[0];
          reset({
            categoryName: categoryData.name,
            categoryDescription: categoryData.description,
          });
          setExistingImage(categoryData.image);
        } catch (error) {
          console.error('Error fetching category:', error);
        }
      };
      fetchCategory();
    }
  }, [categoryId, isEditMode]);

  const editCategory = async (data) => {
    try {
      // const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', data.categoryName);
      formData.append('description', data.categoryDescription);
      
      // Append new image if exists, else keep existing
      if(data.categoryImage && data.categoryImage[0]){
        formData.append('image', data.categoryImage[0]);
      }

      await axios.put(
        `${BASE_URL}/api/dashboard/edit-category/${categoryId}/`, 
        formData, 
        { withCredentials: true },
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      navigate('/admin/dashboard/categories');
    } catch (error) {
      // console.error(error.message);
    }
    setIsSubmitting(false);
  };




  return (
    <>
       <Dashboard>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{isEditMode ? 'Edit Category' : 'Add New Category'}</h2>

          <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <select
              id="categoryName"
              name="categoryName"
              {...register('categoryName', { required: 'Category name is required' })}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              <option value="Bed Room">Bed Room</option>
              <option value="Living Room">Living Room</option>
              <option value="Dining Room">Dining Room</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Office">Office</option>
            </select>
            {errors.categoryName && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryName.message}</p>
            )}
          </div>


            <div className="mb-4">
              <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="categoryDescription"
                name="categoryDescription"
                {...register('categoryDescription', { required: 'Description is required' })}
                rows="4"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter category description"
              ></textarea>
              {errors.categoryDescription && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryDescription.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700">Category Image</label>
              <input
                type="file"
                id="categoryImage"
                name="categoryImage"
                {...register('categoryImage', { required: !isEditMode && 'Category Image is required' })}
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
              {errors.categoryImage && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryImage.message}</p>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center items-center bg-purple-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner /> : (isEditMode ? 'Update Category' : 'Add Category')}
              </button>
            </div>
          </form>
        </div>
      </Dashboard>
    </>
  )
}

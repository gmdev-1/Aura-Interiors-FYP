import React from "react";
import Dashboard from "./Dashboard";
import Spinner from "../components/Spinner";
import { useForm } from "react-hook-form";
import axios from "axios";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useState, useEffect } from "react";

export default function Carousal() {
  const { register, handleSubmit, setError, formState: { errors }, reset, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carousals, setCarousals] = useState([]);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  const onSubmit = (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    addCarousal(data);
  };

  const addCarousal = async (data) => {
    try {
      const formData = new FormData();
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }
      formData.append("image_type", data.image_type);
      if (data.image_type === "category" && data.category){
        formData.append("category", data.category);
      }

      const response = await axios.post(
        `${BASE_URL}/api/dashboard/add-carousal/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },});
          fetchCarousal();
          reset();
    } catch (error) {
      if (error.response?.data){
        Object.entries(error.response.data).forEach(([field, messages]) => {
          setError(field, {message: messages[0]});
        });
      }
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    fetchCarousal();
  }, []);

  const fetchCarousal = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/dashboard/get-carousals/`,
        { withCredentials: true}
      );
      setCarousals(response.data);

      setLoading(false);
    } catch (error) {
      alert("Error fetching carousals")
    }
  };

  const DeleteCarousal = async (carousalId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this carousal?"
    );
    if (!isConfirmed) {
      return;
    }
    const originalCarousals = [...carousals];
    setCarousals((prevCarousals) =>
      prevCarousals.filter((carousal) => carousal.id !== carousalId)
    );
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/dashboard/delete-carousal/${carousalId}/`,
        { withCredentials: true }
      );
      alert("Successfully Deleted");
    } catch (error) {
      setCarousals(originalCarousals);
      alert("Error deleting carousal");
    }
  };

  const imageType = watch("image_type", "home");

  return (
    <>
      <Dashboard>
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4 mt-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-700">Carousal</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="flex items-start space-x-4">
              <div className="w-80">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Carousal Image
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  id="image"
                  name="image"
                  {...register("image", {
                    required: "Carousal Image is required",
                  })}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>
              <div className="w-60">
              <label className="block text-sm font-medium text-gray-700">Image Type</label>
              <div className="flex space-x-4 mt-1">
                <label>
                  <input type="radio" value="home" {...register("image_type", { required: "Select image type" })} defaultChecked />
                  Home
                </label>
                <label>
                  <input type="radio" value="category" {...register("image_type", { required: "Select image type" })} />
                  Category
                </label>
              </div>
              {errors.image_type && <p className="text-red-500 text-sm mt-1">{errors.image_type.message}</p>}
              {imageType === "category" && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">Select Category</label>
                  <select
                    {...register("category", { required: "Category is required" })}
                    className="mt-1 block w-full border border-gray-300 rounded-md"
                  >
                    <option value="">Select a category</option>
                    <option value="Bed Room">Bed Room</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Dining Room">Dining Room</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Office">Office</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>
              )}
            </div>

              <div className="w-32 mt-7">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center bg-purple-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Spinner /> : "Upload"}
                </button>
              </div>
            </div>
          </form>
                  {/* Carousal Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Carousal Images</h2>
          {loading ? (
            <Spinner />
          ) : carousals.length === 0 ? (
            <p className="text-gray-500">No carousals found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {carousals.map((carousal) => (
                <div key={carousal.id} className="relative group rounded-lg overflow-hidden shadow-md">
                  <img
                    src={carousal.image}
                    alt="Carousal"
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    onClick={() => DeleteCarousal(carousal.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <RiDeleteBin6Fill size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
         </div>
       </div>
      </Dashboard>
    </>
  );
}

import React from 'react';
import { useState } from "react";
import Nav from '../components/Nav';
import { useForm } from "react-hook-form";

export default function DesignGenerater() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [designType, setDesignType] = useState("");
  const [generatedImages, setGeneratedImages] = useState([]);

  const roomTypes = ["Living Room", "Bedroom", "Kitchen", "Office", "Dining Room"];
  const designTypes = ["Modern", "Classic", "Industrial", "Minimalist", "Bohemian"];

  const handleGenerate = (data) => {
    // You can use data.fileUpload, data.roomType, and data.designType in your API call.
    // For now, we'll simulate generated images.
    const dummyGeneratedImages = [
      "https://source.unsplash.com/800x600/?interior,living-room",
      "https://source.unsplash.com/800x600/?interior,bedroom",
      "https://source.unsplash.com/800x600/?interior,kitchen",
    ];
    setGeneratedImages(dummyGeneratedImages);
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Left Side: Controls */}
          <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Generate Your Design</h2>
            {/* Form with React Hook Form */}
            <form onSubmit={handleSubmit(handleGenerate)}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="fileUpload">
                  Upload a Room Image
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  {...register("fileUpload", { required: "Room image is required" })}
                  className="border p-2 w-full"
                />
                {errors.fileUpload && (
                  <p className="text-red-500 text-sm mt-1">{errors.fileUpload.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="roomType">
                  Room Type
                </label>
                <select
                  id="roomType"
                  {...register("roomType", { required: "Room type is required" })}
                  className="border p-2 w-full"
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.roomType && (
                  <p className="text-red-500 text-sm mt-1">{errors.roomType.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="designType">
                  Design Type
                </label>
                <select
                  id="designType"
                  {...register("designType", { required: "Design type is required" })}
                  className="border p-2 w-full"
                >
                  <option value="">Select Design Type</option>
                  {designTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.designType && (
                  <p className="text-red-500 text-sm mt-1">{errors.designType.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300 w-full"
              >
                Generate
              </button>
            </form>
          </div>

          {/* Right Side: Gallery */}
          <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Generated Designs</h2>
            {generatedImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={src}
                      alt={`Generated room ${idx + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Your generated images will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

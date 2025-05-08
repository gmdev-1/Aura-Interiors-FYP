import React, { useState } from 'react';
import Nav from '../components/Nav';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Spinner from '../../Store/components/Spinner';
import { MdOutlineFileDownload } from "react-icons/md";

export default function DesignGenerator() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
  
    const hasImage = data.fileUpload?.length > 0;
    const endpoint = hasImage
      ? '/api/imagen/interior-design/control/'
      : '/api/imagen/interior-design/generate/';
  
    try {
      let response;
  
      if (hasImage) {
        // ==== Control-Structure: multipart/form-data ====
        const formData = new FormData();
        formData.append('prompt', data.prompt);
        formData.append('image', data.fileUpload[0]);
        formData.append('control_strength', 0.8);
        formData.append('negative_prompt', 'no clutter');
        formData.append('seed', 42);
        formData.append('style_preset', 'photographic');
  
        response = await axios.post(
          `${BASE_URL}${endpoint}`,
          formData,
          {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
      } else {
        // ==== Text-to-Image: application/json ====
        const jsonPayload = {
          prompt: data.prompt,
          width: 1024,
          height: 1024,
          steps: 30,
          samples: 1,
          cfg_scale: 7,
        };
  
        response = await axios.post(
          `${BASE_URL}${endpoint}`,
          jsonPayload,
          {
            withCredentials: true,
          }
        );
      }
  
      // Both endpoints return { images: [base64, ...] }
      const { images } = response.data;
      const imageUrls = images.map((b64) => `data:image/png;base64,${b64}`);
      setGeneratedImages((prev) => [...prev, ...imageUrls]);
  
    } catch (error) {
      console.error('Image generation failed:', error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Controls */}
          <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Generate Your Design</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="fileUpload" className="block text-gray-700 mb-2">
                  Upload a Room Image (optional)
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  {...register('fileUpload')}
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="prompt" className="block text-gray-700 mb-2">
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  {...register('prompt', { required: 'Prompt is required' })}
                  placeholder="Describe your interior design style and room concept..."
                  className="border p-2 w-full h-32 resize-none"
                />
                {errors.prompt && (
                  <p className="text-red-500 text-sm mt-1">{errors.prompt.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 flex justify-center items-center text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300 w-full"
              >
                {isSubmitting ? <Spinner /> : 'Generate'}
              </button>
            </form>
          </div>

          {/* Gallery */}
          <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Generated Designs</h2>
            {generatedImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative group">
                      <img
                        src={src}
                        alt={`Generated room ${idx + 1}`}
                        className="w-full h-64 object-cover"/>
                      <a
                        href={src}
                        download={`design-${idx + 1}.png`}
                        className="
                          absolute top-2 right-2
                          opacity-0 group-hover:opacity-100
                          bg-white bg-opacity-75 p-1 rounded-full
                          transition-opacity duration-200">
                        <MdOutlineFileDownload className="h-5 w-5 text-gray-700" />
                      </a>
                    </div>
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
  );
}

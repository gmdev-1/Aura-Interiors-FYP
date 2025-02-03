import React from 'react';
import Dashboard from './Dashboard';

export default function AddProduct() {
  return (
    <>
     <Dashboard >
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add Product</h2>

      <form>
        <div className="mb-4">
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter product name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            rows="4"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter product description"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="productSKU" className="block text-sm font-medium text-gray-700">
            SKU
          </label>
          <input
            type="text"
            id="productSKU"
            name="productSKU"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter SKU"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a category</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            <option value="category3">Category 3</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter price"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700">
            Discount Price (Optional)
          </label>
          <input
            type="number"
            id="discountPrice"
            name="discountPrice"
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
            id="stockQuantity"
            name="stockQuantity"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter stock quantity"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="primaryImage" className="block text-sm font-medium text-gray-700">
            Primary Image
          </label>
          <input
            type="file"
            id="primaryImage"
            name="primaryImage"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="additionalImages" className="block text-sm font-medium text-gray-700">
            Additional Images
          </label>
          <input
            type="file"
            id="additionalImages"
            name="additionalImages"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            multiple
          />
        </div>

        <div className="mb-4">
          <label htmlFor="colors" className="block text-sm font-medium text-gray-700">
            Colors
          </label>
          <input
            type="text"
            id="colors"
            name="colors"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter colors (comma-separated)"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">
            Sizes
          </label>
          <input
            type="text"
            id="sizes"
            name="sizes"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter sizes (comma-separated)"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="material" className="block text-sm font-medium text-gray-700">
            Material
          </label>
          <input
            type="text"
            id="material"
            name="material"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter material"
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="featuredProduct"
            name="featuredProduct"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="featuredProduct" className="ml-2 text-sm font-medium text-gray-700">
            Featured Product
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="ratings" className="block text-sm font-medium text-gray-700">
            Ratings
          </label>
          <input
            type="number"
            id="ratings"
            name="ratings"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter ratings"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
    </Dashboard>
    </>
  )
}

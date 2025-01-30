import React from 'react'
import { Link } from 'react-router-dom';

export default function Categories() {
    const images = [
        {
          src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
          label: "Kitchen",
          description: "Modern kitchen solutions for your home",
          items: "250+ items"
        },
        {
          src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
          label: "Wall",
          description: "Stunning wall decor collections",
          items: "180+ items"
        },
        {
          src: "https://images.unsplash.com/photo-1572048572872-2394404cf1f3",
          label: "General",
          description: "Essential home furnishings",
          items: "300+ items"
        },
        {
          src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
          label: "Decor",
          description: "Beautiful decorative pieces",
          items: "200+ items"
        },
        {
          src: "https://images.unsplash.com/photo-1554995207-c18c203602cb",
          label: "Dining Room",
          description: "Elegant dining room furniture",
          items: "150+ items"
        },
      ];
  return (
    <>
      <div className="bg-gray-50 pb-16">
      {/* Section Header */}
      <div className="text-center py-12">
        <h2 className="mt-3 text-4xl font-extrabold text-purple-600 sm:text-5xl">
          Shop by Category
        </h2>
      </div>

      {/* Grid Display */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((category) => (
            <Link
              key={category.label}
              to={`/category/${category.label.toLowerCase()}`}
              className="group block overflow-hidden rounded-lg shadow-md transform transition hover:shadow-lg"
            >
              <div className="relative">
                {/* Image */}
                <img
                  src={category.src}
                  alt={category.label}
                  className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 transition-opacity duration-300" />
                {/* Content */}
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">{category.label}</h3>
                  <p className="mt-1 text-sm text-purple-200">{category.description}</p>
                  <span className="mt-2 inline-block bg-purple-600 text-xs px-3 py-1 rounded-full">
                    {category.items}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

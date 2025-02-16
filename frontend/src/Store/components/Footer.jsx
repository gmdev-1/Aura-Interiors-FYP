import React from 'react'
import { Link } from 'react-router-dom';
import { FiInstagram, FiGlobe, FiArrowUp, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { RiTwitterXFill, RiFacebookBoxFill } from "react-icons/ri";

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
  return (
    <>
       {/* Bold Decorative Separator */}
       <div className="relative h-24 bg-indigo-50">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-50"/>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-6">
            <div className="h-[2px] w-24 bg-purple-600"/>
            <div className="flex gap-3">
              <div className="h-3 w-3 rotate-45 bg-indigo-600"/>
              <div className="h-3 w-3 rotate-45 bg-purple-600"/>
              <div className="h-3 w-3 rotate-45 bg-pink-600"/>
            </div>
            <div className="h-[2px] w-24 bg-purple-600"/>
          </div>
        </div>
      </div>

      <footer className="bg-gradient-to-b from-indigo-50 to-purple-50 text-gray-800">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Company Info section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <span className="font-cinzel text-2xl md:text-3xl font-bold tracking-wider text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                  AURA
                </span>
                <span className="font-playfair text-sm md:text-base tracking-[0.3em] text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                  INTERIORS
                </span>
                <div className="h-0.5 w-16 bg-purple-600 mt-2"/>
              </div>
            </div>

            {/* Quick Links - update hover states */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800 relative inline-block">
                Quick Links
                <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-purple-600"/>
              </h3>
              <ul className="space-y-2">
                {['Shop', 'FAQs'].map((item) => (
                  <li key={item}>
                    <Link 
                      to={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="hover:text-purple-600 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="h-1 w-1 bg-purple-600 rounded-full group-hover:w-2 transition-all duration-300"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Support - similar updates to Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-[#1a3c40] relative inline-block">
                Customer Support
                <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-purple-600"/>
              </h3>
              <ul className="space-y-2">
                {[
                  'Returns & Exchanges',
                  'Shipping Policy',
                  'Privacy Policy',
                  'Terms of Service',
                  'Payment Methods',
                  'Order Tracking'
                ].map((item) => (
                  <li key={item}>
                    <Link 
                      to={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="hover:text-purple-700 transition-colors duration-300 flex items-center gap-2"
                    >
                      <span className="h-1 w-1 bg-purple-600 rounded-full"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-[#1a3c40]/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm">&copy; 2024 Aura Interiors. All rights reserved.</p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {[
                  { icon: <RiFacebookBoxFill size={25} />, label: 'Facebook' },
                  { icon: <FiGlobe size={25} />, label: 'Website' },
                  { icon: <RiTwitterXFill size={25} />, label: 'Twitter' },
                  { icon: <FiInstagram size={25} />, label: 'Instagram' }
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    className="text-gray-800 hover:text-purple-600 transform hover:-translate-y-1 transition-all duration-300"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Scroll to Top Button */}
              <button
                onClick={scrollToTop}
                className="fixed bottom-8 right-5 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
                aria-label="Scroll to top"
              >
                <FiArrowUp size={24} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

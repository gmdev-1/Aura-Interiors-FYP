import React from 'react'
import Navbar from '../components/Navbar'
import HomeCarousal from '../components/HomeCarousal'
import Categories from '../components/Categories'
import Product from '../components/Product'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
        <Navbar />
        <HomeCarousal />
        <Categories />
        <Product />
        <Footer /> 
    </>
  )
}

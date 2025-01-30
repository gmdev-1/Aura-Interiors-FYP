import React from 'react'
import Navbar from '../components/Navbar'
import Carousal from '../components/Carousal'
import Categories from '../components/Categories'
import Product from '../components/Product'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
        <Navbar />
        <Carousal />
        <Categories />
        <Product />
        <Footer /> 
    </>
  )
}

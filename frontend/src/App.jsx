import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './Store/pages/Home';
import Login from './Store/components/Login';
import Signup from './Store/components/Signup';
import ForgotPassword from './Store/components/ForgotPassword';
import Dashboard from './Admin/pages/Dashboard';
import Product from './Admin/pages/Product';
import AddProduct from './Admin/pages/AddProduct';
import Category from './Admin/pages/Category';
import AddCategory from './Admin/pages/AddCategory';

function App() {

  return (
    <>
     <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/auth/login" element={<Login/>} />
          <Route exact path="/auth/signup" element={<Signup/>} />
          <Route exact path="/auth/forgot-password" element={<ForgotPassword />} />

          <Route exact path="/admin/dashboard" element={<Dashboard />} />
          <Route exact path="/admin/dashboard/products" element={<Product />} />
          <Route exact path="/admin/dashboard/add-product" element={<AddProduct />} />
          <Route exact path="/admin/dashboard/categories" element={<Category/>} />
          <Route exact path="/admin/dashboard/add-category" element={<AddCategory/>} />
          <Route exact path="/admin/dashboard/edit-category/:categoryId" element={<AddCategory />} />
          
        </Routes>
      </Router>
    </>
  )
}

export default App

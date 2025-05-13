import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import Home from './Store/pages/Home';
import Login from './Store/components/Login';
import Signup from './Store/components/Signup';
import ForgotPassword from './Store/components/ForgotPassword';
import Dashboard from './Admin/pages/Dashboard';
import Product from './Admin/pages/Product';
import AddProduct from './Admin/pages/AddProduct';
import Category from './Admin/pages/Category';
import AddCategory from './Admin/pages/AddCategory';
import Carousal from './Admin/pages/Carousal';
import Cart from './Store/pages/Cart';
import ProductDetail from './Store/pages/ProductDetail';
import AdminSignup from './Admin/pages/AdminSignup';
import AdminLogin from './Admin/pages/AdminLogin';
import ProtectedRoute from './Admin/components/ProtectedRoute';
import AuthLayout from './Admin/components/AuthLayout';
import Shop from './Store/pages/Shop';
import VerifyEmail from './Store/components/VerifyEmail';
import Order from './Order/pages/Order';
import UserAuthLayout from './Store/components/UserAuthLayout';
import UserProtectedRoute from './Store/components/UserProtectedRoute';
import { CartProvider } from './Store/context/CartContext';
import OrderHistory from './Order/pages/OrderHistory';
import OrderDetail from './Order/pages/OrderDetail';
import OrdersHistory from './Admin/pages/OrdersHistory';
import OrdersDetail from './Admin/pages/OrdersDetail';
import Landing from './ImageGeneration/pages/Landing';
import DesignGenerater from './ImageGeneration/pages/DesignGenerater';
import SearchResults from './Admin/pages/SearchResults';


function AnalyticsListener() {
  const location = useLocation();
  useEffect(() => {
    const page_path = location.pathname + location.search;
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);
  return null;
}

function App() {

  ReactGA.initialize("G-L662N5CB4B");

  return (
    <>
     <Router>
        <AnalyticsListener />
           <CartProvider>
        <Routes>
          <Route path="/" element={<UserAuthLayout />} >
            <Route exact path="/" element={<Home />} />
            <Route exact path="/category/:category" element={<Shop />} />
            <Route exact path="/user/signup" element={<Signup/>} />
            <Route exact path="/user/login" element={<Login/>} />
            <Route exact path="/user/verify-email" element={<VerifyEmail />} />
            <Route exact path="/user/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/cart" element={<Cart />} />
            <Route exact path="/product-detail/:name" element={<ProductDetail />} />
            <Route exact path="/shop" element={<Shop/>} />
            <Route exact path="/imagen" element={<Landing />} />
            <Route exact path="/order" element={<UserProtectedRoute ><Order /></UserProtectedRoute>} />
            <Route exact path="/order/order-history" element={<UserProtectedRoute ><OrderHistory /></UserProtectedRoute>} />
            <Route exact path="/order/order-detail/:order_id" element={<UserProtectedRoute ><OrderDetail /></UserProtectedRoute>} />
            <Route exact path="/imagen/design/generate" element={<UserProtectedRoute ><DesignGenerater /></UserProtectedRoute>} />
          </Route>

          <Route exact path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AuthLayout />}> 
            <Route exact path="/admin/signup" element={<ProtectedRoute ><AdminSignup /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route exact path="/admin/dashboard/products" element={<ProtectedRoute><Product /></ProtectedRoute>}/>
            <Route exact path="/admin/dashboard/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>}/>
            <Route exact path="/admin/dashboard/edit-product/:productId" element={<ProtectedRoute><AddProduct /></ProtectedRoute>}/>
            <Route exact path="/admin/dashboard/categories" element={<ProtectedRoute><Category/></ProtectedRoute>}/>
            <Route exact path="/admin/dashboard/add-category" element={<ProtectedRoute><AddCategory/></ProtectedRoute>}/>
            <Route exact path="/admin/dashboard/edit-category/:categoryId" element={<ProtectedRoute><AddCategory /></ProtectedRoute>}/>
            <Route exact path="/admin/dashboard/carousal" element={<ProtectedRoute><Carousal /></ProtectedRoute>}/>
            <Route exact path="/admin/dashboard/orders" element={<ProtectedRoute><OrdersHistory /></ProtectedRoute>}/>
            <Route exact path="/admin/dashboard/orders/order-detail/:order_id" element={<ProtectedRoute><OrdersDetail /></ProtectedRoute>}/>
            <Route exact path="/admin/dashboard/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>}/>
          </Route>
        </Routes>
      </CartProvider>
      </Router>
    </>
  )
}

export default App

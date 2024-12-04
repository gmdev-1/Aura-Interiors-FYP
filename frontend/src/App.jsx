import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Layout from "./components/Layout";
import ForgotPassword from "./components/ForgotPassword";
import SigninPage from "./pages/auth/SigninPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/user/HomePage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage/>} />
          <Route exact path="/admin/dashboard" element={<Layout />} />
          <Route exact path="/auth/signin" element={ <SigninPage />} />
          <Route exact path="/auth/signup" element={ <SignupPage />}/>
          <Route exact path="/auth/forgot-password" element={ <ForgotPassword/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;

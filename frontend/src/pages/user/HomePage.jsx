import React from 'react'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <>
      <Navbar/>
      <Link to="/admin/dashboard">admin</Link>
    </>
  )
}

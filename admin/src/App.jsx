// import { useState } from 'react'
import{ BrowserRouter , Route , Routes } from 'react-router-dom'
import './App.css'
import AdminLogin from './Pages/Login/Login.jsx'
import AdminRegister from './Pages/Login/Register.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLogin/>}/>
          <Route path="/register" element={<AdminRegister/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

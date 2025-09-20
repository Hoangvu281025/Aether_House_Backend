import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import './MainLayout.css'
const MainLayout = () => {
  return (
    <div className="layout">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="right-content">
        <Header />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

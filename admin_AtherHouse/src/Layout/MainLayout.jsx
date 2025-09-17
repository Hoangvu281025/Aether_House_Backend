import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";

const MainLayout = () => {
  return (
    <div>
      {/* Sidebar bên trái */}
      <Sidebar />

      {/* Header phía trên */}
      <Header />

      {/* Nội dung các page */}
      <main style={{ marginLeft: "300px", padding: "20px" , background:"#F9FAFB" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

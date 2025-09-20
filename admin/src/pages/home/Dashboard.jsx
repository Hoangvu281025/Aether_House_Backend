import React from "react";
import "./Dashbroad.css";
import { FaUsers, FaBox } from "react-icons/fa";

const Dashbroad = () => {
  return (
    <div className="dashboard">
      <div className="cards">
        {/* Customers */}
        <div className="card">
          <div className="card-icon">
            <FaUsers  className="card-icon-svg" />
          </div>
          <div className="card-info">
            <h3>Customers</h3>
            <p className="number">3,782</p>
            <span className="percent up">▲ 11.01%</span>
          </div>
        </div>

        {/* Orders */}
        <div className="card">
          <div className="card-icon">
            <FaBox  className="card-icon-svg"/>
          </div>
          <div className="card-info">
            <h3>Orders</h3>
            <p className="number">5,359</p>
            <span className="percent down">▼ 9.05%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashbroad;

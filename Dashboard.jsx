import React from "react";
import { Package, AlertTriangle, ShoppingCart, IndianRupee } from "lucide-react";
import "../Styles/Dashboard.css";

export default function Dashboard({ inventory = {}, orders = [], sales = [] }) {
  const minimumStock = 10;

  const allItems = Object.values(inventory).flat();

  const totalItems = allItems.length;

  const lowStock = allItems.filter(
    (item) => item.stock < minimumStock
  ).length;

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        📊 Dashboard
      </h1>

      {/* Top Summary Cards */}
      <div className="dashboard-cards-grid">
        <Card
          icon={<Package />}
          title="Total Items"
          value={totalItems}
          color="purple"
        />

        <Card
          icon={<AlertTriangle />}
          title="Low Stock"
          value={lowStock}
          color="red"
        />

        <Card
          icon={<ShoppingCart />}
          title="Total Orders"
          value={orders.length}
          color="blue"
        />

        <Card
          icon={<IndianRupee />}
          title="Revenue"
          value={`₹ ${totalRevenue}`}
          color="green"
        />
      </div>

      {/* Category Summary */}
      <h2 className="dashboard-subtitle">
        Category Overview
      </h2>

      <div className="category-grid">
        {Object.keys(inventory).map((category) => (
          <div
            key={category}
            className="category-card"
          >
            <h3 className="category-title">
              {category}
            </h3>
            <p className="category-info">
              Items: {inventory[category].length}
            </p>
            <p className="category-info">
              Low Stock:{" "}
              {
                inventory[category].filter(
                  (item) => item.stock < minimumStock
                ).length
              }
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ icon, title, value, color }) {
  const colors = {
    purple: "card-icon-purple",
    red: "card-icon-red",
    blue: "card-icon-blue",
    green: "card-icon-green",
  };

  const valueColors = {
    purple: "card-value-purple",
    red: "card-value-red",
    blue: "card-value-blue",
    green: "card-value-green",
  };

  return (
    <div className="card">
      <div className={`card-icon ${colors[color]}`}>
        {icon}
      </div>
      <div className="card-content">
        <p className="card-title">{title}</p>
        <p className={`card-value ${valueColors[color]}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
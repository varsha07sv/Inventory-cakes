
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Inventory from "./Pages/Inventory";
import Orders from "./Pages/Orders";
import Sales from "./Pages/Sales";
import Login from "./Pages/Login";

function App() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Login />;
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "30px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/inventory"
            element={
              user.role === "admin" ? (
                <Inventory />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/orders" element={<Orders />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

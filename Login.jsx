import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import {
  FaBirthdayCake,
  FaTachometerAlt,
  FaBoxes,
  FaShoppingCart,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={sidebarStyle}>
      <div style={logoStyle}>
        <FaBirthdayCake size={30} color="#6a4e7a" />
        <h2 style={titleStyle}>Cake Shop</h2>
      </div>

      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>
          <FaTachometerAlt style={iconStyle} />
          Dashboard
        </Link>

        {user?.role === "admin" && (
          <Link to="/inventory" style={linkStyle}>
            <FaBoxes style={iconStyle} />
            Inventory
          </Link>
        )}

        <Link to="/orders" style={linkStyle}>
          <FaShoppingCart style={iconStyle} />
          Orders
        </Link>

        <Link to="/sales" style={linkStyle}>
          <FaChartLine style={iconStyle} />
          Sales
        </Link>

        <button onClick={logout} style={logoutButtonStyle}>
          <FaSignOutAlt style={iconStyle} />
          Logout
        </button>
      </nav>

      {user && (
        <div style={userInfoStyle}>
          <p style={userRoleStyle}>
            {user.role === "admin" ? "👑 Admin" : "👤 Employee"}
          </p>
          <p style={userNameStyle}>{user.username}</p>
        </div>
      )}
    </div>
  );
}

const sidebarStyle = {
  width: "250px",
  height: "100vh",
  background: "linear-gradient(180deg, #e6d5e6 0%, #d9c0d9 100%)",
  padding: "25px 15px",
  boxShadow: "2px 0 10px rgba(128, 0, 128, 0.1)",
  display: "flex",
  flexDirection: "column",
  position: "sticky",
  top: 0,
};

const logoStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "30px",
  borderBottom: "2px solid #b39bc8",
  paddingBottom: "15px",
};

const titleStyle = {
  color: "#4a2e4a",
  margin: 0,
  fontSize: "1.3rem",
  fontWeight: "600",
};

const navStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  flex: 1,
};

const linkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 15px",
  color: "#4a3b4a",
  textDecoration: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  fontWeight: "500",
};

const iconStyle = {
  fontSize: "1.2rem",
  color: "#6a4e7a",
};

const logoutButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 15px",
  color: "#4a3b4a",
  backgroundColor: "transparent",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "500",
  marginTop: "auto",
  width: "100%",
  textAlign: "left",
};

const userInfoStyle = {
  marginTop: "20px",
  padding: "15px",
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  borderRadius: "8px",
  border: "1px solid #b39bc8",
};

const userRoleStyle = {
  margin: "0 0 5px 0",
  color: "#4a2e4a",
  fontSize: "0.9rem",
  fontWeight: "600",
};

const userNameStyle = {
  margin: 0,
  color: "#6b4e71",
  fontSize: "0.9rem",
  fontStyle: "italic",
};

export default Sidebar;
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import TaskManager from "./components/TaskManager";

import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav style={styles.navbar}>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <Link to="/signup" style={styles.navLink}>Signup</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/login" style={styles.navLink}>Login</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/tasks" style={styles.navLink}>Task Manager</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tasks" element={<TaskManager />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#007BFF",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  navList: {
    listStyleType: "none",
    display: "flex",
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: "0 15px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "color 0.3s",
  },
  navLinkHover: {
    color: "#FFD700",
  },
};

export default App;
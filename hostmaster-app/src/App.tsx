import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Services from "./pages/Services";
import Reviews from "./pages/Reviews";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Accommodations from "./pages/Accommodations";
import Customers from "./pages/Customers";
import Footer from "./components/Footer";
import Reports from "./pages/Reports";
import Maintenances from "./pages/Maintenances";
import Calendar from "./pages/Calendar";
import Users from "./pages/Users";
import RoleProtectedRoute from "./context/RoleProtectedRoute";

const App: React.FC = () => {
  return (
    <div className="background">
      <Navbar />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/accommodations"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <Accommodations />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <RoleProtectedRoute allowedRoles={["admin", "employee"]}>
                <Rooms />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <RoleProtectedRoute allowedRoles={["admin", "employee"]}>
                <Bookings />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <RoleProtectedRoute allowedRoles={["admin", "employee"]}>
                <Services />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/maintenances"
            element={
              <RoleProtectedRoute allowedRoles={["admin", "employee"]}>
                <Maintenances />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <RoleProtectedRoute allowedRoles={["admin", "employee"]}>
                <Calendar />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <RoleProtectedRoute allowedRoles={["admin", "employee"]}>
                <Customers />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <RoleProtectedRoute allowedRoles={["admin", "employee"]}>
                <Reviews />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <Reports />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </RoleProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
};

export default App;

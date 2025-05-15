import React from "react";
import {
  Container,
  Navbar,
  Nav,
  OverlayTrigger,
  Tooltip,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBed,
  FaClipboardList,
  FaConciergeBell,
  FaStar,
  FaHotel,
  FaGlobe,
  FaTools,
  FaChartBar,
  FaUsers,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import logo from "../assets/hotel.svg";
import { FaCalendarDays } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

const NavigationBar: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "es" : "en");
  };

  const { userRole, logout } = useAuth();

  // Definir los enlaces según el rol del usuario
  const roleBasedLinks = [
    {
      path: "/accommodations",
      label: "navbar.accommodations",
      icon: <FaHotel size={30} />,
      roles: ["admin"],
    },
    {
      path: "/rooms",
      label: "navbar.rooms",
      icon: <FaBed size={30} />,
      roles: ["admin", "manager"],
    },
    {
      path: "/bookings",
      label: "navbar.bookings",
      icon: <FaClipboardList size={30} />,
      roles: ["admin", "manager"],
    },
    {
      path: "/services",
      label: "navbar.services",
      icon: <FaConciergeBell size={30} />,
      roles: ["admin", "manager"],
    },
    {
      path: "/maintenances",
      label: "navbar.maintenances",
      icon: <FaTools size={30} />,
      roles: ["admin", "manager"],
    },
    {
      path: "/calendar",
      label: "navbar.calendar",
      icon: <FaCalendarDays size={30} />,
      roles: ["admin", "manager"],
    },
    {
      path: "/reviews",
      label: "navbar.reviews",
      icon: <FaStar size={30} />,
      roles: ["admin", "manager"],
    },
    {
      path: "/reports",
      label: "navbar.reports",
      icon: <FaChartBar size={30} />,
      roles: ["admin"],
    },
    {
      path: "/customers",
      label: "navbar.customers",
      icon: <FaUsers size={30} />,
      roles: ["admin"],
    },
  ];

  return (
    <Navbar expand="lg" variant="dark" className="navbar-custom">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          style={{ fontSize: "1.8rem", fontWeight: "bold" }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: "40px", marginRight: "10px" }}
          />
          HostMaster
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>{t("navbar.home")}</Tooltip>}
            >
              <Nav.Link as={Link} to="/">
                <FaHome size={30} />
              </Nav.Link>
            </OverlayTrigger>

            {/* Enlaces según el rol */}
            {roleBasedLinks.map((link) =>
              link.roles.includes(userRole ?? "") ? (
                <OverlayTrigger
                  key={link.path}
                  placement="bottom"
                  overlay={<Tooltip>{t(link.label)}</Tooltip>}
                >
                  <Nav.Link
                    as={Link}
                    to={link.path}
                    style={{ padding: "10px 15px" }}
                  >
                    {link.icon}
                  </Nav.Link>
                </OverlayTrigger>
              ) : null
            )}
          </Nav>

          {userRole ? (
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>{t("navbar.logout")}</Tooltip>}
            >
              <Nav.Link onClick={logout}>
                <FaSignOutAlt size={30} />
              </Nav.Link>
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>{t("navbar.login")}</Tooltip>}
            >
              <Nav.Link as={Link} to="/login">
                <FaSignInAlt size={30} />
              </Nav.Link>
            </OverlayTrigger>
          )}

          {/* Botón para cambiar de idioma */}
          <Button
            variant="Icon"
            onClick={toggleLanguage}
            className="text-light ms-3"
            style={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            <FaGlobe size={28} /> {i18n.language.toUpperCase()}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

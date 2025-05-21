import React, { useState } from "react";
import {
  Container,
  Navbar,
  Nav,
  OverlayTrigger,
  Tooltip,
  Button,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
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
  FaHouseUser,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import logo from "../assets/hotel.svg";
import { FaCalendarDays } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

const NavigationBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { userRole, logout } = useAuth();

  const [expanded, setExpanded] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "es" : "en");
  };

  const handleLogOut = () => {
    logout();
    setExpanded(false);
    navigate("/");
  };

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
      roles: ["admin", "employee"],
    },
    {
      path: "/bookings",
      label: "navbar.bookings",
      icon: <FaClipboardList size={30} />,
      roles: ["admin", "employee"],
    },
    {
      path: "/services",
      label: "navbar.services",
      icon: <FaConciergeBell size={30} />,
      roles: ["admin", "employee"],
    },
    {
      path: "/maintenances",
      label: "navbar.maintenances",
      icon: <FaTools size={30} />,
      roles: ["admin", "employee"],
    },
    {
      path: "/calendar",
      label: "navbar.calendar",
      icon: <FaCalendarDays size={30} />,
      roles: ["admin", "employee"],
    },
    {
      path: "/reviews",
      label: "navbar.reviews",
      icon: <FaStar size={30} />,
      roles: ["admin", "employee"],
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
      icon: <FaHouseUser size={30} />,
      roles: ["admin", "employee"],
    },
    {
      path: "/users",
      label: "navbar.users",
      icon: <FaUsers size={30} />,
      roles: ["admin"],
    },
  ];

  return (
    <Navbar
      expand="lg"
      variant="dark"
      className="navbar-custom"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
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
              <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                <FaHome size={30} />
              </Nav.Link>
            </OverlayTrigger>

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
                    onClick={() => setExpanded(false)}
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
              <Nav.Link onClick={handleLogOut}>
                <FaSignOutAlt size={30} />
              </Nav.Link>
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>{t("navbar.login")}</Tooltip>}
            >
              <Nav.Link
                as={Link}
                to="/login"
                onClick={() => setExpanded(false)}
              >
                <FaSignInAlt size={30} />
              </Nav.Link>
            </OverlayTrigger>
          )}

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

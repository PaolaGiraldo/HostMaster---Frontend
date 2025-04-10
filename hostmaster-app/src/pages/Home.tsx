import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Carousel, Container, Row, Col, Card } from "react-bootstrap";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../index.css";

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container className="home-container">
      {/* Carrusel de imágenes */}
      <Carousel className="home-carousel">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/fotoHome1.jpg"
            alt="Hotel 1"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/fotoHome2.jpg"
            alt="Hotel 2"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/fotoHome3.jpg"
            alt="Hotel 3"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/fotoHome4.jpg"
            alt="Hotel 4"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/fotoHome5.jpg"
            alt="Hotel 5"
          />
        </Carousel.Item>
      </Carousel>

      {/* Información sobre los alojamientos */}
      <section className="mt-4 text-center">
        <h2>{t("home.aboutTitle")}</h2>
        <p className="lead">{t("home.aboutDescription")}</p>
      </section>

      {/* Servicios destacados */}
      <Row className="mt-4">
        <Col md={4}>
          <Card className="service-card">
            <Card.Body>
              <Card.Title>{t("home.service1Title")}</Card.Title>
              <Card.Text>{t("home.service1Description")}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="service-card">
            <Card.Body>
              <Card.Title>{t("home.service2Title")}</Card.Title>
              <Card.Text>{t("home.service2Description")}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="service-card">
            <Card.Body>
              <Card.Title>{t("home.service3Title")}</Card.Title>
              <Card.Text>{t("home.service3Description")}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Información de contacto */}
      <section className="contact-info mt-5">
        <h3>{t("home.contactTitle")}</h3>
        <p>
          <FaMapMarkerAlt /> 123 Calle Principal, Ciudad
        </p>
        <p>
          <FaPhoneAlt /> +123 456 789
        </p>
        <p>
          <FaEnvelope /> info@example.com
        </p>
      </section>
    </Container>
  );
};

export default Home;

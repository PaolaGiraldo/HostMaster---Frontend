import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaPhoneAlt,
  FaInfoCircle,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={6}>
            <h5>
              <FaInfoCircle size={20} /> {t("footer.about")}
            </h5>
            <p>{t("footer.aboutText")}</p>
            <div className="social-icons">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </Col>
          <Col md={6} className="text-md-end">
            <h5>{t("footer.contact")}</h5>
            <p>
              <FaEnvelope size={15} /> {t("footer.email")}:
              contact@hostmaster.com
            </p>
            <p>
              <FaPhoneAlt size={15} /> {t("footer.phone")}: +123 456 7890
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

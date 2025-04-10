import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Accommodation } from "../../interfaces/accommodationInterface";
import { useLocation } from "../../context/LocationContext";

interface AccommodationFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (accommodation: Accommodation) => void;
  editingAccommodation?: any;
}

const AccommodationForm: React.FC<AccommodationFormProps> = ({
  show,
  onHide,
  onSave,
  editingAccommodation,
}) => {
  const { t } = useTranslation();
  const { countries, states, cities } = useLocation();

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);

  const [formState, setFormState] = useState<Accommodation>({
    name: "",
    address: "",
    city_id: 0,
    information: "",
    images: [],
    rooms: [],
  });

  // Cargar datos si se edita un alojamiento
  useEffect(() => {
    if (editingAccommodation) {
      setFormState(editingAccommodation);
      const selectedCity = cities.find(
        (city) => city.id === editingAccommodation.city_id
      );

      if (selectedCity) {
        setSelectedState(selectedCity.state_id);

        // Buscar el estado en la lista de estados
        const selectedStateObj = states.find(
          (state) => state.id === selectedCity.state_id
        );

        if (selectedStateObj) {
          setSelectedCountry(selectedStateObj.country_id);
        }
      }
    } else {
      setFormState({
        name: "",
        address: "",
        city_id: 0,
        information: "",
        images: [],
        rooms: [],
      });
      setSelectedCountry(null);
    }
  }, [editingAccommodation, cities]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = Number(e.target.value);
    setSelectedCountry(countryId);
    setSelectedState(null);
    setFormState({ ...formState, city_id: 0 }); // Resetear ciudad al cambiar de país
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = Number(e.target.value);
    setSelectedState(stateId);
    setFormState({ ...formState, city_id: 0 }); // Resetear ciudad al cambiar de estado
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState({ ...formState, city_id: Number(e.target.value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
    onHide();
    setFormState({
      name: "",
      address: "",
      city_id: 0,
      information: "",
      images: [],
      rooms: [],
    });
    setSelectedState(null);
    setSelectedCountry(null);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingAccommodation
            ? t("accommodations.edit")
            : t("accommodations.newAccommodation")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>{t("accommodations.name")}</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("accommodations.address")}</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formState.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Select de País */}
          <Form.Group className="mb-3">
            <Form.Label>{t("accommodations.country")}</Form.Label>
            <Form.Select
              value={selectedCountry ?? ""}
              onChange={handleCountryChange}
              required
            >
              <option value="">{t("accommodations.selectCountry")}</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Select de Estado */}
          <Form.Group className="mb-3">
            <Form.Label>{t("accommodations.state")}</Form.Label>
            <Form.Select
              name="state_id"
              value={selectedState || ""}
              onChange={handleStateChange}
              required
              disabled={!selectedCountry}
            >
              <option value="">{t("accommodations.selectState")}</option>
              {states
                .filter((state) => state.country_id === selectedCountry)
                .map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          {/* Select de Ciudad */}
          <Form.Group className="mb-3">
            <Form.Label>{t("accommodations.city")}</Form.Label>
            <Form.Select
              name="city_id"
              value={formState.city_id || ""}
              onChange={handleCityChange}
              required
              disabled={!selectedState || !selectedCountry}
            >
              <option value="">{t("accommodations.selectCity")}</option>
              {cities
                .filter((city) => city.state_id === selectedState)
                .map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("accommodations.info")}</Form.Label>
            <Form.Control
              as="textarea"
              name="information"
              value={formState.information}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={onHide}>
              {t("cancel")}
            </Button>
            <Button variant="primary" type="submit" className="ms-2">
              {editingAccommodation ? t("update") : t("save")}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AccommodationForm;

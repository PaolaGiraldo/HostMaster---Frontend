import React, { createContext, useContext, useEffect, useState } from "react";
import locationService from "../Services/locationService";

interface LocationContextType {
  countries: any[];
  states: any[];
  cities: any[];
  fetchLocations: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const fetchLocations = async () => {
    try {
      const [countriesData, statesData, citiesData] = await Promise.all([
        locationService.getCountries(),
        locationService.getStates(),
        locationService.getCities(),
      ]);

      setCountries(countriesData);
      setStates(statesData);
      setCities(citiesData);

      // Guardar en localStorage
      localStorage.setItem("countries", JSON.stringify(countriesData));
      localStorage.setItem("states", JSON.stringify(statesData));
      localStorage.setItem("cities", JSON.stringify(citiesData));
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  };

  useEffect(() => {
    const cachedCountries = localStorage.getItem("countries");
    const cachedStates = localStorage.getItem("states");
    const cachedCities = localStorage.getItem("cities");

    if (cachedCountries && cachedStates && cachedCities) {
      setCountries(JSON.parse(cachedCountries));
      setStates(JSON.parse(cachedStates));
      setCities(JSON.parse(cachedCities));
    } else {
      fetchLocations(); // Si no hay cache, obtiene los datos del backend
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{ countries, states, cities, fetchLocations }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation debe usarse dentro de LocationProvider");
  }
  return context;
};

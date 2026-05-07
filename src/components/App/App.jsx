import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { apiKey } from "../../utils/constants";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import AddItemModal from "../AddItemModal/AddItemModal";
import ItemModal from "../ItemModal/ItemModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import Profile from "../Profile/Profile";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { addItem, getItems, deleteItem } from "../../utils/api";
import { signUp, signIn, validateToken } from "../../utils/auth";

function App() {
  const fallbackCoordinates = {
    latitude: 34.2257,
    longitude: -77.9447,
  };

  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
    condition: "",
    isDay: true,
  });
  const [locationCoords, setLocationCoords] = useState(fallbackCoordinates);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [clothingItems, setClothingItems] = useState([]);
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    weather: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleFormReset = (inputValues) => {
    setFormData(inputValues);
  };

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    handleFormReset();
    setActiveModal("add-garment");
  };

  const openLoginModal = () => {
    setActiveModal("login");
  };

  const openRegisterModal = () => {
    setActiveModal("sign-up");
  };

  const handleDeleteItem = () => {
    const token = localStorage.getItem("jwt");
    deleteItem(selectedCard._id, token)
      .then(() => {
        const id = selectedCard._id;
        setClothingItems((prev) => prev.filter((item) => item._id !== id));
        closeActiveModal();
      })
      .catch(console.error);
  };

  const onAddItem = (inputValues) => {
    const token = localStorage.getItem("jwt");
    addItem(inputValues, token)
      .then((data) => {
        setClothingItems([data, ...clothingItems]);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const saveCurrentUser = (data) => {
    const user = data?.user ?? data;
    if (user && user._id) {
      setCurrentUser(user);
    }
  };

  const onRegister = (inputValues) => {
    signUp(inputValues)
      .then((data) => {
        const token = data?.token;
        if (!token) {
          return Promise.reject("No token returned from signup");
        }
        localStorage.setItem("jwt", token);
        return validateToken(token);
      })
      .then((userData) => {
        saveCurrentUser(userData);
        setIsLoggedIn(true);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const onLogin = (inputValues) => {
    signIn(inputValues)
      .then((data) => {
        const token = data?.token;
        if (!token) {
          return Promise.reject("No token returned from signin");
        }
        localStorage.setItem("jwt", token);
        return validateToken(token);
      })
      .then((userData) => {
        saveCurrentUser(userData);
        setIsLoggedIn(true);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      validateToken(token)
        .then((data) => {
          saveCurrentUser(data);
          setIsLoggedIn(true);
        })
        .catch(() => {
          localStorage.removeItem("jwt");
          setCurrentUser(null);
          setIsLoggedIn(false);
        });
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not available; using fallback coordinates.");
      setLocationCoords(fallbackCoordinates);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn(
          "Geolocation failed, using fallback coordinates:",
          error.message,
        );
        setLocationCoords(fallbackCoordinates);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60 * 1000,
      },
    );
  }, []);

  useEffect(() => {
    getWeather(locationCoords, apiKey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch(console.error);

    getItems()
      .then((data) => {
        setClothingItems(data.reverse());
      })
      .catch(console.error);
  }, [locationCoords]);

  return (
    <CurrentTemperatureUnitContext.Provider
      value={{ currentTemperatureUnit, handleToggleSwitchChange }}
    >
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <div className="page__content">
            <Header
              handleAddClick={handleAddClick}
              onLoginClick={openLoginModal}
              onRegisterClick={openRegisterModal}
              weatherData={weatherData}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    weatherData={weatherData}
                    handleCardClick={handleCardClick}
                    clothingItems={clothingItems}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile
                      clothingItems={clothingItems}
                      handleCardClick={handleCardClick}
                      handleAddClick={handleAddClick}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>

            <Footer />
          </div>

          <AddItemModal
            isOpen={activeModal === "add-garment"}
            onAddItem={onAddItem}
            onClose={closeActiveModal}
          />
          <ItemModal
            isOpen={activeModal === "preview"}
            card={selectedCard}
            onClose={closeActiveModal}
            handleDelete={handleDeleteItem}
          />
          <RegisterModal
            isOpen={activeModal === "sign-up"}
            onRegister={onRegister}
            onClose={closeActiveModal}
          />
          <LoginModal
            isOpen={activeModal === "login"}
            onLogin={onLogin}
            onClose={closeActiveModal}
          />
        </div>
      </CurrentUserContext.Provider>
    </CurrentTemperatureUnitContext.Provider>
  );
}

export default App;

import { useContext, useReducer } from "react";
import { createContext } from "react";
import { useEffect } from "react";
import jsonData from "../../db.json";

const BASE_URL = "/.netlify/functions/";
const CitiesContext = createContext();

const initialState = {
  city: [],
  isLoading: false,
  currentCity: {},
  errorMessage: "",
};

function reducer(state, action) {
  let tempState = {};

  switch (action.type) {
    case "loading": {
      tempState = JSON.parse(localStorage.getItem("citiesList"));

      if (tempState?.length === 0) {
        localStorage.setItem("citiesList", JSON.stringify(jsonData.cities));
        tempState.city = [...jsonData.cities];
      }
      return {
        ...state,
        city: [...tempState.city],
        isLoading: true,
      };
    }
    case "error":
      return { ...state, errorMessage: action.payload, isLoading: false };
    case "load/cities": {
      localStorage.setItem("citiesList", JSON.stringify({ city: [] }));
      tempState = { ...state, city: action.payload, isLoading: false };

      return tempState;
    }
    case "load/currentCity":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "create/city": {
      tempState = {
        ...state,
        city: [...state.city, action.payload],
        isLoading: false,
      };
      localStorage.setItem("citiesList", JSON.stringify(tempState));
      return tempState;
    }
    case "delete/city": {
      tempState = {
        ...state,
        isLoading: false,
        city: state.city.filter((c) => c.id !== action.payload),
      };
      localStorage.setItem("citiesList", JSON.stringify(tempState));
      return { ...tempState };
    }
    default:
      throw new Error("Unknown action type.");
  }
}

function CitiesProvider({ children }) {
  const [{ city, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}loadCities`);
        const data = await res.json();
        dispatch({ type: "load/cities", payload: data });
      } catch {
        dispatch({
          type: "error",
          payload: "There was an error while loading data",
        });
      }
    }

    fetchCities();
  }, []);

  async function getCityDetail(id) {
    try {
      dispatch({ type: "loading" });

      const cities = JSON.parse(localStorage.getItem("citiesList"));
      const city = cities.city.filter((c) => c.id === id);

      dispatch({ type: "load/currentCity", payload: city[0] });
    } catch {
      dispatch({
        type: "error",
        payload: "There is an error while fetching the city data",
      });
      throw new Error("There is an error while fetching the city data");
    }
  }

  async function createNewCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}createCity`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      dispatch({ type: "create/city", payload: data });
    } catch {
      dispatch({
        type: "error",
        payload: "There was an error while creating the city",
      });
      throw new Error("There was an error while creating the city");
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}deleteCity/?id=${id}`, { method: "DELETE" });
      dispatch({ type: "delete/city", payload: id });
    } catch {
      dispatch({
        type: "error",
        payload: "There was an error while deleting the city",
      });
      throw new Error("There was an error while deleting the city");
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        city,
        isLoading,
        currentCity,
        getCityDetail,
        createNewCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCitiesContext() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error(
      "CitiesContext was used outside of the CitiesProvider in DOM tree."
    );
  return context;
}

export { CitiesProvider, useCitiesContext };

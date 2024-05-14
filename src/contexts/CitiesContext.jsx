import { useContext, useReducer } from "react";
import { createContext } from "react";
import { useEffect } from "react";

const BASE_URL = "https://world-wise-gldn.netlify.app/.netlify/functions/api/";
const CitiesContext = createContext();

const initialState = {
  city: [],
  isLoading: false,
  currentCity: {},
  errorMessage: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "error":
      return { ...state, errorMessage: action.payload, isLoading: false };
    case "load/cities":
      return { ...state, city: action.payload, isLoading: false };
    case "load/currentCity":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "create/city":
      return {
        ...state,
        city: [...state.city, action.payload],
        isLoading: false,
      };
    case "delete/city":
      return {
        ...state,
        isLoading: false,
        city: state.city.filter((c) => c.id !== action.payload),
      };
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
        const res = await fetch(`${BASE_URL}cities`);
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
      const data = await fetch(`${BASE_URL}cities/${id}`);
      const res = await data.json();
      dispatch({ type: "load/currentCity", payload: res });
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
      const res = await fetch(`${BASE_URL}cities`, {
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
      await fetch(`${BASE_URL}cities/${id}`, { method: "DELETE" });
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

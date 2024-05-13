// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useURLParams } from "../hooks/useURLParams";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import ButtonBack from "./ButtonBack";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCitiesContext } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGetCity, setIsLoadingGetCity] = useState(false);
  const [isErrGetCity, setErrGetCity] = useState("");

  const { lat, lng } = useURLParams();
  const [emoji, setEmoji] = useState("");
  const { createNewCity } = useCitiesContext();
  const navigate = useNavigate();

  useEffect(
    function () {
      async function getClickedCityInfo() {
        try {
          if (!lat && !lng) return;
          setNotes("");
          setErrGetCity("");
          setIsLoadingGetCity(true);
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          setCountry(data.countryName);
          if (!data?.countryCode)
            throw new Error("There is no city in there. Opps... ");
          setCityName(data.city || data.locality || "");
          setEmoji(data?.countryCode);
        } catch (err) {
          setErrGetCity(err.message);
        } finally {
          setIsLoadingGetCity(false);
        }
      }
      getClickedCityInfo();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    const newCity = {
      cityName,
      country,
      date,
      notes,
      position: { lat, lng },
      emoji,
    };

    await createNewCity(newCity);
    navigate("/app/cities");
  }

  if (isLoadingGetCity) return <Spinner />;

  if (isErrGetCity) return <Message message={isErrGetCity} />;

  if (!lat & !lng) return <Message message="Start by clicking on the map" />;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>
          {emoji && (
            <img
              src={`https://flagcdn.com/16x12/${emoji.toLowerCase()}.png`}
              alt="flag"
            />
          )}
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          wrapperClassName="datePicker"
          onChange={(date) => setDate(date)}
          selected={date}
          id="date"
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;

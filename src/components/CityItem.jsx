import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCitiesContext } from "../contexts/CitiesContext";

function CityItem({ city }) {
  const {
    cityName,
    date,
    id,
    position: { lat, lng },
    emoji,
  } = city;

  const { currentCity, deleteCity } = useCitiesContext();

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  async function handleDelete(e) {
    e.preventDefault();
    await deleteCity(id);
  }

  return (
    <li>
      <Link
        to={`${id}?lat=${lat}&lng=${lng}`}
        className={`${styles.cityItem} ${
          currentCity.id === id ? styles["cityItem--active"] : ""
        }  `}
      >
        <span className={styles.emoji}>
          <img
            src={`https://flagcdn.com/16x12/${emoji.toLowerCase()}.png`}
            alt="flag"
          />
        </span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button onClick={(e) => handleDelete(e)} className={styles.deleteBtn}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;

import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem.jsx";
import Message from "./Message.jsx";
import Spinner from "./Spinner.jsx";
import { useCitiesContext } from "../contexts/CitiesContext.jsx";

function CountryList() {
  const { city, isLoading } = useCitiesContext();

  if (isLoading) return <Spinner />;
  if (!city.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  const countries = city.reduce((acc, curElement) => {
    if (acc.map((el) => el.country).includes(curElement.country))
      return [...acc];
    else {
      return [...acc, { emoji: curElement.emoji, country: curElement.country }];
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country, indx) => (
        <CountryItem country={country} key={indx} />
      ))}
    </ul>
  );
}

export default CountryList;

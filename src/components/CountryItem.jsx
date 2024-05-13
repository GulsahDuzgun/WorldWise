import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>
        <img
          src={`https://flagcdn.com/16x12/${country.emoji.toLowerCase()}.png`}
          alt="flag"
        />
      </span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;

import styles from "./AppLayout.module.css";
import Sideabar from "../components/Sidebar";
import Map from "../components/Map";
import User from "../components/User";

export default function AppLayout() {
  return (
    <div className={styles.app}>
      <User />
      <Sideabar />
      <Map />
    </div>
  );
}

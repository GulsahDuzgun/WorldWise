import { useNavigate } from "react-router-dom";
import {
  TileLayer,
  MapContainer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCitiesContext } from "../contexts/CitiesContext";
import { useGetGeolocation } from "../hooks/useGetGeolocation";

import styles from "./Map.module.css";
import Button from "./Button";
import { useURLParams } from "../hooks/useURLParams";

function Map() {
  const [mapPosition, setMapPosition] = useState([
    40.46635901755316, 3.7133789062500004,
  ]);
  const { lat, lng } = useURLParams();
  const {
    isLoading: isGeoLocationLoading,
    position: geoPosition,
    getPosition,
  } = useGetGeolocation();

  const { city } = useCitiesContext();

  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (geoPosition) setMapPosition([geoPosition.lat, geoPosition.lng]);
    },
    [geoPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geoPosition && (
        <Button type="position" handleClick={getPosition}>
          {isGeoLocationLoading ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={6}
        scrollWhellZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {city.map((cElement) => (
          <Marker
            key={cElement.id}
            position={[cElement.position.lat, cElement.position.lng]}
          >
            <Popup>
              {cElement.cityName}
              <img
                alt="flag"
                src={`https://flagcdn.com/16x12/${cElement.emoji.toLowerCase()}.png`}
              />
            </Popup>
          </Marker>
        ))}
        <ChangeMapMarker position={mapPosition} />
        <GetClickedPosition />
      </MapContainer>
    </div>
  );
}

function ChangeMapMarker({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function GetClickedPosition() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;

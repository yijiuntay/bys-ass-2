import { useState, useMemo, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import "./App.css";

const LIBRARIES = ["places"];
const containerStyle = {
  width: "400px",
  height: "400px",
};

function Places() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    id: "google-map-script",
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const [center, setCenter] = useState({ lat: 51, lng: 0 });
  const [selected, setSelected] = useState(null);

  return isLoaded ? (
    <>
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} setCenter={setCenter} />
      </div>

      <GoogleMap
        zoom={2}
        center={center}
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </>
  ) : (
    <div>Loading...</div>
  );
}

const PlacesAutocomplete = ({ setSelected, setCenter }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
    setCenter({ lat, lng });
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={data.map(({ description }) => description)}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Search an address" />
      )}
      value={value}
      onInputChange={(e, value) => {
        setValue(value);
      }}
      onChange={(e, value) => {
        handleSelect(value);
      }}
      disabled={!ready}
      className="combobox-input"
    />
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">🔍</header>
      <Places />
    </div>
  );
}

export default App;

import { useState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete from "use-places-autocomplete";
import { useSelector, useDispatch } from "react-redux";
import { fetchLatLng } from "./features/history/historySlice";
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
  const center = useSelector((state) => state.center);
  const markers = useSelector((state) => state.markers);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <>
      <div className="places-container">
        <PlacesAutocomplete />
      </div>

      <GoogleMap
        zoom={2}
        center={center}
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markers.length > 0 &&
          markers.map((marker) => <Marker position={marker} />)}
      </GoogleMap>
    </>
  ) : (
    <div>Loading...</div>
  );
}

const PlacesAutocomplete = () => {
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

    let latlng = await dispatch(fetchLatLng(address));
  };

  const dispatch = useDispatch();

  return (
    <>
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
    </>
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

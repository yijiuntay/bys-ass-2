import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getGeocode, getLatLng } from "use-places-autocomplete";

export const fetchLatLng = createAsyncThunk(
  "history/addMarker",
  async (address) => {
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    return { lat, lng };
  }
);

export const historySlice = createSlice({
  name: "history",
  initialState: {
    markers: [],
    center: { lat: 51, lng: 0 },
  },
  reducers: {},
  extraReducers(builder = {}) {
    builder
      .addCase(fetchLatLng.pending, (state, action) => {
        return;
      })
      .addCase(fetchLatLng.fulfilled, (state, action) => {
        state.markers.push(action.payload);
        state.center = action.payload;
      })
      .addCase(fetchLatLng.rejected, (state, action) => {
        return;
      });
  },
});

export const { addMarker } = historySlice.actions;

export default historySlice.reducer;

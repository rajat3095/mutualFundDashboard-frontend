import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Use the environment variable, or fallback to localhost if it's missing
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchInvestors = createAsyncThunk(
  "investors/fetchAll",
  async () => {
    // 1. Frontend makes the HTTP GET request to the Backend
    const response = await fetch(`${API_URL}/investors`);

    if (!response.ok) {
      throw new Error("Failed to fetch investors");
    }

    // 2. Backend returns JSON data, which is passed to the Redux store
    return response.json();
  },
);

const investorSlice = createSlice({
  name: "investors",
  initialState: { list: [], status: "idle", error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInvestors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchInvestors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      });
  },
});

export default investorSlice.reducer;

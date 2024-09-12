import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getUserById, logout } from "./userSlice";

interface Stock {
  id: number;
  symbol: string;
  name: string;
  current_price: number;
}

export interface UserStock {
  id: number;
  user_id: number;
  stock_id: number;
  symbol: string;
  name: string;
  quantity: number;
  average_buy_price: number;
}
interface StockState {
  stocks: Stock[];
  loading: boolean;
  error: string | null;
  userStocks: UserStock[];
}

const initialState: StockState = {
  stocks: [],
  loading: false,
  error: null,
  userStocks: [], // Initialize as an empty array
};
const getToken = () => localStorage.getItem("token");
export const fetchAllStocks = createAsyncThunk(
  "stocks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/api/stock");
      if (!response.ok) {
        throw new Error("Failed to fetch stocks");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchStockBySymbol = createAsyncThunk(
  "stocks/fetchBySymbol",
  async (symbol: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/stock/${symbol}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch stocks with symbol ${symbol}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
export const buyStock = createAsyncThunk(
  "stock/buyStock",
  async (
    {
      userId,
      stockId,
      quantity,
    }: { userId: number; stockId: number; quantity: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:3000/api/stock/buy", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, stockId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to buy stock");
      }

      const data = await response.json();
      await dispatch(refreshUserStocks(userId));
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const sellStock = createAsyncThunk(
  "stock/sellStock",
  async (
    {
      userId,
      stockId,
      quantity,
    }: { userId: number; stockId: number; quantity: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:3000/api/stock/sell", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, stockId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sell stock");
      }

      const data = await response.json();
      await dispatch(refreshUserStocks(userId));
      return data.updatedStock; // Assume the API returns the updated stock info
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUserStocks = createAsyncThunk(
  "stock/fetchUserStocks",
  async (userId: number, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:3000/api/stock/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user stocks");
      }

      const data = await response.json();

      return data; // Assume the API returns the updated stock info
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
export const refreshUserStocks = createAsyncThunk(
  "stock/refreshUserStocks",
  async (userId: number, { dispatch }) => {
    await dispatch(fetchUserStocks(userId));
    await dispatch(getUserById(userId));
  }
);
const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllStocks.fulfilled,
        (state, action: PayloadAction<Stock[]>) => {
          state.loading = false;
          state.stocks = action.payload;
        }
      )
      .addCase(fetchAllStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStockBySymbol.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStockBySymbol.fulfilled,
        (state, action: PayloadAction<Stock[]>) => {
          state.loading = false;
          state.stocks = action.payload;
        }
      )
      .addCase(fetchStockBySymbol.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        buyStock.fulfilled,
        (state, action: PayloadAction<UserStock>) => {}
      )
      .addCase(buyStock.rejected, (state, action) => {
        state.error = action.payload as string;
      }) // Add this to your extraReducers
      .addCase(
        sellStock.fulfilled,
        (state, action: PayloadAction<UserStock>) => {}
      )
      .addCase(sellStock.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchUserStocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.userStocks = action.payload;
      })
      .addCase(fetchUserStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout, (state) => {
        state.userStocks = []; // Clear user stocks when logging out
      });
  },
});

export default stockSlice.reducer;

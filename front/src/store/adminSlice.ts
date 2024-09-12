// src/slices/adminSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Admin {
  id: number;
  username: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  balance: number;
  account_status: string;
  failedLoginAttempts: number;
}

interface AdminState {
  currentAdmin: Admin | null;
  isLoading: boolean;
  error: string | null;
  users: User[];
  isLoggedIn: boolean;
}

const initialState: AdminState = {
  currentAdmin: null,
  isLoading: false,
  error: null,
  users: [],
  isLoggedIn: false,
};

export const adminLogin = createAsyncThunk(
  "admin/login",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("adminToken", data.token);
      return data.admin;
    } catch (error) {
      return rejectWithValue("Login failed");
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "admin/updateUserStatus",
  async (
    { userId, status }: { userId: number; status: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No admin token found");
      }

      const response = await fetch(
        "http://localhost:3000/api/admin/user-status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to update user status"
        );
      }

      const data = await response.json();
      dispatch(fetchAllUsers());
      return data;
    } catch (error) {
      return rejectWithValue("Failed to update user status");
    }
  }
);
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("No admin token found");
      }

      const response = await fetch(
        "http://localhost:3000/api/admin/getAllUser",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch users");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminLogout: (state) => {
      state.currentAdmin = null;
      state.users = [];
      localStorage.removeItem("adminToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.isLoading = false;
        state.currentAdmin = action.payload;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAllUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.isLoading = false;
          state.users = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { adminLogout } = adminSlice.actions;
export default adminSlice.reducer;

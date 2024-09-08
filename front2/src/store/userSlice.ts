import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  balance: number;
  last_login: string | null;
  account_status: "active" | "suspended" | "inactive";
  created_at: string;
  updated_at: string;
}

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  requiresVerification: boolean; // For tracking if 2FA is required
  userId: number | null; // Track user ID after login for verification step
  lastActivity: number | null;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
  requiresVerification: false,
  userId: null,
  lastActivity: Date.now(), // Add this line
};
interface LoginResponse {
  userId: number;
  requiresVerification: boolean;
}
export const registerUser = createAsyncThunk(
  "user/register",
  async (
    {
      username,
      password,
      email,
      fullName,
    }: {
      username: string;
      password: string;
      email: string;
      fullName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, fullName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      return data.user;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Registration failed");
    }
  }
);
export const loginUser = createAsyncThunk(
  "user/login",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      return {
        userId: data.userId,
        requiresVerification: true,
      } as LoginResponse;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Login failed");
    }
  }
);

export const verifyCode = createAsyncThunk(
  "user/verifyCode",
  async (
    { userId, code }: { userId: number; code: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      return data.user;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Verification failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.requiresVerification = false;
      state.userId = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requiresVerification = true;
        state.userId = action.payload.userId;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.requiresVerification = false;
        state.userId = null;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload)); // Add this line
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    // ... (registerUser cases remain the same)
  },
});

export const { logout, setUser, updateLastActivity } = userSlice.actions;
export default userSlice.reducer;

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
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        `http://localhost:3000/api/auth/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user data");
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch user data");
    }
  }
);
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
        // Reject with the full error data object, which contains both message and errorCode
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return {
        userId: data.userId,
        requiresVerification: true,
      } as LoginResponse;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      }
      return rejectWithValue({ message: "Login failed" });
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
        console.log("action.payload.userId;", action.payload.userId);
        state.userId = action.payload.userId;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        switch (action.payload) {
          case "INVALID_CREDENTIALS":
            state.error = "Incorrect username or password";
            break;
          case "ACCOUNT_INACTIVE":
            state.error = "Your account is inactive. Please contact support.";
            break;
          default:
            state.error = "Login failed. Please try again.";
        }
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
      })
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUser, updateLastActivity } = userSlice.actions;
export default userSlice.reducer;

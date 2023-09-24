import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import newToast from "../../services/toast";
import authService from "./authService";

const isLoggedIn = JSON.parse(localStorage.getItem("restaurant"));
const initialState = {
  isLoggedIn: isLoggedIn ? isLoggedIn : null,
  loading: {
    register: false,
    login: false,
  },
  error: {
    register: null,
    login: null,
  },
};

export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      const response = await authService.register(JSON.stringify(user));
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      newToast(result.message, "green");
      return result;
    } catch (error) {
      newToast(error.message, "red");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    const response = await authService.login(JSON.stringify(user));
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    localStorage.setItem("restaurant", JSON.stringify(result.data));
    return result;
  } catch (error) {
    newToast(error.message, "red");
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const logout = createAsyncThunk(
  "auth/logout",
  async (data = null, thunkAPI) => {
    try {
      const response = await authService.logout();
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      localStorage.removeItem("restaurant");
      newToast(result.message, "blue");
      return result;
    } catch (error) {
      newToast(error.message, "red");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = {
        register: false,
        login: false,
      };
      state.error = {
        register: null,
        login: null,
      };
    },
    logoutUser: (state) => {
      (state.isLoggedIn = null),
        (state.loading = {
          register: false,
          login: false,
        });
      state.error = {
        register: null,
        login: null,
      };
      localStorage.removeItem("restaurant");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading.register = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading.register = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading.register = false;
      })

      .addCase(login.pending, (state) => {
        state.loading.login = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading.login = false;
        state.isLoggedIn = action.payload.data;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading.login = false;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = null;
      });
  },
});

export const { reset, logoutUser } = authSlice.actions;
export default authSlice.reducer;

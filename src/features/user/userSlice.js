import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import newToast from "../../services/toast.js";
import { logout, logoutUser } from "../auth/authSlice.js";
import userService from "./userService.js";

const initialState = {
  user: null,
  cart: [],
  loading: {
    getUser: false,
  },
  error: {
    getUser: null,
  },
  isSuccess: false,
};

export const getUser = createAsyncThunk(
  "user/getUser",
  async (data = null, thunkAPI) => {
    try {
      const response = await userService.getUser();
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
      newToast(error.message, "red");
      if (error.message === "You are not authorized to access this route") {
        thunkAPI.dispatch(logoutUser());
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const likeProduct = createAsyncThunk(
  "user/likeProduct",
  async (id, thunkAPI) => {
    try {
      const response = await userService.likeProduct(id);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
      newToast(error.message, "red");
      if (error.message === "You are not authorized to access this route") {
        thunkAPI.dispatch(logoutUser());
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editDetails = createAsyncThunk(
  "user/editDetails",
  async (data, thunkAPI) => {
    try {
      const response = await userService.editDetails(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      newToast(result.message, "green");
      return result;
    } catch (error) {
      newToast(error.message, "red");
      if (error.message === "You are not authorized to access this route") {
        thunkAPI.dispatch(logoutUser());
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state, action) => {
        state.user = null;
        state.loading = {
          getUser: false,
        };
        state.error = {
          getUser: null,
        };
        state.isSuccess = false;
      })
      .addCase(getUser.pending, (state) => {
        state.loading.getUser = true;
        state.isSuccess = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading.getUser = false;
        state.error.getUser = null;
        state.user = action.payload.data;
        state.isSuccess = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.user = null;
        state.loading.getUser = false;
        state.error.getUser = null;
        state.isSuccess = false;
      })
      .addCase(likeProduct.fulfilled, (state, action) => {
        state.user = action.payload.data;
      })
      .addCase(editDetails.fulfilled, (state, action) => {
        state.user = action.payload.data;
      });
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;

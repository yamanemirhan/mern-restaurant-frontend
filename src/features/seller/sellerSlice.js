import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import newToast from "../../services/toast";
import sellerService from "./sellerService";
import { logoutUser } from "../auth/authSlice";

const initialState = {
  products: [],
  loading: {
    getProducts: false,
    addProduct: false,
  },
  error: {
    getProducts: null,
    addProduct: null,
  },
  isSuccess: false,
};

export const getProducts = createAsyncThunk(
  "seller/getProducts",
  async (query, thunkAPI) => {
    try {
      const response = await sellerService.getProductsAPI(query);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
      if (error.message === "You are not authorized to access this route") {
        thunkAPI.dispatch(logoutUser());
      }
      newToast(error.message, "red");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "seller/addProduct",
  async (data, thunkAPI) => {
    try {
      const response = await sellerService.addProductAPI(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      newToast(result.message, "green");
      return result;
    } catch (error) {
      if (error.message === "You are not authorized to access this route") {
        thunkAPI.dispatch(logoutUser());
      }
      newToast(error.message, "red");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "seller/updateProduct",
  async ({ data, id }, thunkAPI) => {
    try {
      const response = await sellerService.updateProduct(data, id);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      newToast(result.message, "blue");
      return result;
    } catch (error) {
      if (error.message === "You are not authorized to access this route") {
        thunkAPI.dispatch(logoutUser());
      }
      newToast(error.message, "red");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "seller/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const response = await sellerService.deleteProduct(id);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      newToast(result.message, "purple");
      return id;
    } catch (error) {
      if (error.message === "You are not authorized to access this route") {
        thunkAPI.dispatch(logoutUser());
      }
      newToast(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    reset: (state) => {
      // state.isError = false;
      // state.isSuccess = false;
      // state.isLoading = false;
      // state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading.getProducts = false;
        state.products = action.payload.data.products;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading.addProduct = true;
      })
      .addCase(addProduct.rejected, (state) => {
        state.loading.addProduct = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading.addProduct = false;
        state.products.unshift(action.payload.data);
      })
      .addCase(updateProduct.pending, (state) => {
        state.isSuccess = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload.data;
        const productId = updatedProduct._id;

        const index = state.products.findIndex(
          (product) => product._id === productId
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
        state.isSuccess = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const productId = action.payload;
        state.products = state.products.filter(
          (product) => product._id !== productId
        );
      });
  },
});

export const { reset } = sellerSlice.actions;
export default sellerSlice.reducer;

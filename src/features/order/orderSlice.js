import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import newToast from "../../services/toast";
import orderService from "./orderService";
import { logoutUser } from "../auth/authSlice";

const initialState = {
  orders: [],
  currentOrder: null,
  currentQuantity: 1,
  loading: {
    createOrder: false,
    fetchSellerOrders: false,
    addComment: false,
  },
  error: {
    createOrder: null,
    fetchSellerOrders: null,
    addComment: null,
  },
};

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (data, thunkAPI) => {
    try {
      const response = await orderService.createOrderAPI(data);
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

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (id, thunkAPI) => {
    try {
      const response = await orderService.deleteOrderAPI(id);
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

export const fetchSellerOrders = createAsyncThunk(
  "order/fetchSellerOrders",
  async (data = null, thunkAPI) => {
    try {
      const response = await orderService.fetchSellerOrdersAPI();
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

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async (data, thunkAPI) => {
    try {
      const response = await orderService.updateOrderAPI(data);
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

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    decreaseQuantityOrder: (state, action) => {
      state.currentQuantity -= 1;
    },
    increaseQuantityOrder: (state, action) => {
      state.currentQuantity += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading.createOrder = true;
      })
      .addCase(createOrder.rejected, (state) => {
        state.loading.createOrder = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading.createOrder = false;
        state.currentOrder = action.payload.data;
        state.currentQuantity = 1;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        const orderId = action.payload.data;
        state.orders = state.orders.filter((order) => order._id !== orderId);
      })
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading.fetchSellerOrders = true;
      })
      .addCase(fetchSellerOrders.rejected, (state) => {
        state.loading.fetchSellerOrders = false;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading.fetchSellerOrders = false;
        state.orders = action.payload.data;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload.data;
        const orderIdToUpdate = updatedOrder._id;

        for (let i = 0; i < state.orders.length; i++) {
          if (state.orders[i]._id === orderIdToUpdate) {
            state.orders[i] = updatedOrder;
            break;
          }
        }
      });
  },
});

export const { decreaseQuantityOrder, increaseQuantityOrder } =
  orderSlice.actions;
export default orderSlice.reducer;

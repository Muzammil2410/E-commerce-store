/**
 * Orders slice - createOrder, fetchMyOrders, fetchSellerOrders
 * Uses backend /api/orders with JWT (axios interceptor attaches token).
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthToken } from '@/lib/api/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ORDERS_URL = `${API_BASE}/api/orders`;

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('[Orders] Submitting order', { itemCount: orderData.items?.length, totalAmount: orderData.totalAmount });
      const token = getAuthToken();
      if (!token) {
        console.log('[Orders] Create failure: No auth token');
        return rejectWithValue({ message: 'Please log in to place an order' });
      }
      const response = await axios.post(ORDERS_URL, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[Orders] Order created successfully', response.data?.id);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to place order';
      console.log('[Orders] Create error:', message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue({ message: 'Please log in to view orders' });
      }
      const response = await axios.get(`${ORDERS_URL}/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[Orders] Fetched my orders:', response.data?.length ?? 0);
      return response.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch orders';
      console.log('[Orders] fetchMyOrders error:', message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const fetchSellerOrders = createAsyncThunk(
  'orders/fetchSellerOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue({ message: 'Please log in as seller' });
      }
      const response = await axios.get(`${ORDERS_URL}/seller`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[Orders] Fetched seller orders:', response.data?.length ?? 0);
      return response.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch seller orders';
      console.log('[Orders] fetchSellerOrders error:', message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    orderDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload && action.payload.id) {
          state.orders = [action.payload, ...state.orders];
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || 'Failed to place order';
      })
      // fetchMyOrders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.orders = [];
        state.error = action.payload?.message || action.payload || 'Failed to fetch orders';
      })
      // fetchSellerOrders
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.orders = [];
        state.error = action.payload?.message || action.payload || 'Failed to fetch seller orders';
      });
  },
});

export const { clearOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;

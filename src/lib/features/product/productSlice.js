import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for API (use env in production)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api/products`;

// Normalize product from API: _id -> id, title -> name, full URLs for images
function normalizeProduct(p) {
    if (!p) return p;
    const base = { ...p };
    if (base._id) base.id = base._id.toString();
    if (base.title) base.name = base.title;
    if (Array.isArray(base.images) && base.images.length) {
        base.images = base.images.map(src =>
            src.startsWith('http') ? src : `${API_BASE}${src.startsWith('/') ? '' : '/'}${src}`
        );
    }
    return base;
}

// Async Thunks
export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            const list = Array.isArray(response.data) ? response.data.map(normalizeProduct) : [];
            return list;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch products' });
        }
    }
);

export const addProduct = createAsyncThunk(
    'product/addProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return normalizeProduct(response.data);
        } catch (error) {
            const msg = error.response?.data?.message || error.response?.data?.error || 'Failed to add product';
            return rejectWithValue(typeof error.response?.data === 'object' ? { ...error.response.data, message: msg } : msg);
        }
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearProduct: (state) => {
            state.list = [];
        },
        resetStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch products';
            })
            // Add Product
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.list.unshift(action.payload); // Add new product to start of list
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to add product';
                state.success = false;
            });
    }
});

export const { clearProduct, resetStatus } = productSlice.actions;

export default productSlice.reducer;
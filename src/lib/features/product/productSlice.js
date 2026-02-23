import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for API (use env in production)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api/products`;

// Normalize product from API: _id -> id, title -> name, full URLs for images
// Handles real-time Cloudinary URLs from database
function normalizeProduct(p) {
    if (!p) return p;
    const base = { ...p };
    
    // Convert MongoDB _id to id for frontend
    if (base._id) base.id = base._id.toString();
    
    // Convert title to name (frontend expects name)
    if (base.title) base.name = base.title;
    
    // Handle images - Cloudinary URLs are already full URLs, keep as-is
    if (Array.isArray(base.images) && base.images.length) {
        base.images = base.images.map(src => {
            // If already a full Cloudinary URL (starts with http/https), use as-is
            if (src.startsWith('http://') || src.startsWith('https://')) {
                return src;
            }
            // Otherwise, prepend API base URL (for local uploads if any)
            return `${API_BASE}${src.startsWith('/') ? '' : '/'}${src}`;
        });
    }
    
    // Ensure optional fields exist for frontend compatibility
    // Frontend expects rating array (can be empty)
    if (!base.rating) base.rating = [];
    
    // Frontend expects mrp (use price if salePrice exists, otherwise use price)
    if (!base.mrp && base.price) {
        base.mrp = base.salePrice ? base.price : base.price;
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

/** Fetch only products belonging to the logged-in seller (requires auth token). */
export const fetchSellerProducts = createAsyncThunk(
    'product/fetchSellerProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/seller`);
            const list = Array.isArray(response.data) ? response.data.map(normalizeProduct) : [];
            return list;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch seller products' });
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

export const fetchProductById = createAsyncThunk(
    'product/fetchProductById',
    async (productId, { rejectWithValue }) => {
        try {
            if (!productId) {
                throw new Error('Product ID is required');
            }
            console.log('Fetching product by ID:', productId);
            console.log('API URL:', `${API_URL}/${productId}`);
            
            const response = await axios.get(`${API_URL}/${productId}`);
            
            if (!response.data) {
                throw new Error('No product data received');
            }
            
            const normalized = normalizeProduct(response.data);
            console.log('Product fetched successfully:', productId, '- Title:', normalized?.title || normalized?.name);
            return normalized;
        } catch (error) {
            console.error('Error fetching product:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            // Handle 404 specifically
            if (error.response?.status === 404) {
                return rejectWithValue({ message: 'Product not found', status: 404 });
            }
            
            // Handle network errors
            if (!error.response) {
                return rejectWithValue({ message: 'Network error: Could not connect to server', status: 0 });
            }
            
            const msg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch product';
            return rejectWithValue({ 
                message: msg, 
                status: error.response?.status || 500,
                ...(typeof error.response?.data === 'object' ? error.response.data : {})
            });
        }
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [],
        currentProduct: null, // Single product detail
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
            // Fetch Seller Products
            .addCase(fetchSellerProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellerProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchSellerProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch seller products';
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
            })
            // Fetch Product By ID
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentProduct = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch product';
                state.currentProduct = null;
            });
    }
});

export const { clearProduct, resetStatus } = productSlice.actions;

export default productSlice.reducer;
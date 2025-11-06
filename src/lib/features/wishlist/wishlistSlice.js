import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: {},
        total: 0
    },
    reducers: {
        addToWishlist: (state, action) => {
            const productId = action.payload.productId
            if (!state.items[productId]) {
                state.items[productId] = action.payload
                state.total += 1
            }
        },
        removeFromWishlist: (state, action) => {
            const productId = action.payload.productId
            if (state.items[productId]) {
                delete state.items[productId]
                state.total -= 1
            }
        },
        clearWishlist: (state) => {
            state.items = {}
            state.total = 0
        },
        setWishlist: (state, action) => {
            state.items = action.payload.items || {}
            state.total = action.payload.total || 0
        }
    }
})

export const { addToWishlist, removeFromWishlist, clearWishlist, setWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer

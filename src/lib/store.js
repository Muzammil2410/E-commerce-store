import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import productReducer from './features/product/productSlice'
import addressReducer from './features/address/addressSlice'
import ratingReducer from './features/rating/ratingSlice'
import wishlistReducer from './features/wishlist/wishlistSlice'
import tasksReducer from './features/tasks/tasksSlice'
import attendanceReducer from './features/attendance/attendanceSlice'
import leaveReducer from './features/leave/leaveSlice'
import employeesReducer from './features/employees/employeesSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer,
            product: productReducer,
            address: addressReducer,
            rating: ratingReducer,
            wishlist: wishlistReducer,
            tasks: tasksReducer,
            attendance: attendanceReducer,
            leave: leaveReducer,
            employees: employeesReducer,
        },
    })
}
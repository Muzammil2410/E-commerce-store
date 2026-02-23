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
import chatReducer from './features/chat/chatSlice'
import announcementsReducer from './features/announcements/announcementsSlice'
import documentsReducer from './features/documents/documentsSlice'
import profileReducer from './features/profile/profileSlice'
import workLogReducer from './features/workLog/workLogSlice'
import achievementsReducer from './features/achievements/achievementsSlice'
import goalsReducer from './features/goals/goalsSlice'
import ordersReducer from './features/orders/ordersSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer,
            product: productReducer,
            orders: ordersReducer,
            address: addressReducer,
            rating: ratingReducer,
            wishlist: wishlistReducer,
            tasks: tasksReducer,
            attendance: attendanceReducer,
            leave: leaveReducer,
            employees: employeesReducer,
            chat: chatReducer,
            announcements: announcementsReducer,
            documents: documentsReducer,
            profile: profileReducer,
            workLog: workLogReducer,
            achievements: achievementsReducer,
            goals: goalsReducer,
        },
    })
}
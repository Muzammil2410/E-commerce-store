'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Counter = ({ productId }) => {

    const { cartItems } = useSelector(state => state.cart);

    const dispatch = useDispatch();

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }))
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 dark:border-gray-700 dark:bg-gray-700 max-sm:text-sm text-slate-600 dark:text-gray-200 transition-colors duration-200">
            <button onClick={removeFromCartHandler} className="p-1 select-none dark:text-gray-200 dark:hover:text-gray-100">-</button>
            <p className="p-1 dark:text-gray-200">{cartItems[productId]}</p>
            <button onClick={addToCartHandler} className="p-1 select-none dark:text-gray-200 dark:hover:text-gray-100">+</button>
        </div>
    )
}

export default Counter
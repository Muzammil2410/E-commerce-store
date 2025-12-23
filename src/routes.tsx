import { createBrowserRouter } from "react-router-dom";
// import { lazy, Suspense, ReactNode } from "react";
import React, { lazy, Suspense, type ReactNode } from "react";

import PublicLayout from "@/app/(public)/layout";
import AdminRoot from "@/app/admin/layout";
import StoreRoot from "@/app/store/layout";
import Loading from "@/components/Loading";
// Import AuthLogin directly instead of lazy loading to avoid Router context issues
import AuthLogin from "@/app/(public)/auth/login/page";
// Import Home directly to fix React context issue with lazy loading
import Home from "@/app/(public)/page";
// Import AccountTypeSelection directly to fix React context issue with lazy loading
import AccountTypeSelection from "@/app/(public)/auth/page";
// Import Seller and Product directly to fix React context issue with lazy loading
import Seller from "@/app/(public)/seller/page";
import Product from "@/app/(public)/product/[productId]/page";
// Import Checkout, Cart, and Bargain directly to fix React context issue with lazy loading
import Checkout from "@/app/(public)/checkout/page";
import Cart from "@/app/(public)/cart/page";
import Bargain from "@/app/(public)/bargain/page";
// Import Shop directly to fix React context issue with lazy loading
import Shop from "@/app/(public)/shop/page";
// Import Profile directly since it's used after login
import Profile from "@/app/(public)/profile/page";
// Import Wishlist directly since it's accessed from navbar
import Wishlist from "@/app/(public)/wishlist/page";
// Import Orders directly to fix React context issues
import Orders from "@/app/(public)/orders/page";
// Import SellerDashboard directly since it's used after seller login
import SellerDashboard from "@/app/(public)/seller/dashboard/page";
// Import SellerRegister directly since it's accessed from seller page
import SellerRegister from "@/app/(public)/seller/register/page";
// Import SellerLogin directly to fix React context issues
import SellerLogin from "@/app/(public)/seller/login/page";
// Import all seller dashboard pages directly to fix React context issues
import SellerProducts from "@/app/(public)/seller/dashboard/products/page";
import SellerProductsAdd from "@/app/(public)/seller/dashboard/products/add/page";
import SellerProductsEdit from "@/app/(public)/seller/dashboard/products/edit/[id]/page";
import SellerProductsView from "@/app/(public)/seller/dashboard/products/view/[id]/page";
import SellerSales from "@/app/(public)/seller/dashboard/sales/page";
import SellerOrders from "@/app/(public)/seller/dashboard/orders/page";
import SellerDelivery from "@/app/(public)/seller/dashboard/delivery/page";
import SellerDeliverySchedule from "@/app/(public)/seller/dashboard/delivery/schedule/page";

// Lazy load pages for code splitting and better performance
const Pricing = lazy(() => import("@/app/(public)/pricing/page"));
const ShopUser = lazy(() => import("@/app/(public)/shop/[username]/page"));
const Login = lazy(() => import("@/app/(public)/login/page"));
const Register = lazy(() => import("@/app/(public)/register/page"));
const AuthRegister = lazy(() => import("@/app/(public)/auth/register/page"));
const AuthForgot = lazy(() => import("@/app/(public)/auth/forgot-password/page"));
const ForgotPassword = lazy(() => import("@/app/(public)/forgot-password/page"));
const PrivacyPolicy = lazy(() => import("@/app/(public)/privacy-policy/page"));
const Support = lazy(() => import("@/app/(public)/support/page"));
const AdminPage = lazy(() => import("@/app/admin/page"));
const AdminStores = lazy(() => import("@/app/admin/stores/page"));
const AdminCoupons = lazy(() => import("@/app/admin/coupons/page"));
const AdminApprove = lazy(() => import("@/app/admin/approve/page"));
const StorePage = lazy(() => import("@/app/store/page"));
const StoreOrders = lazy(() => import("@/app/store/orders/page"));
const StoreAddProduct = lazy(() => import("@/app/store/add-product/page"));
const StoreManageProduct = lazy(() => import("@/app/store/manage-product/page"));

// ✅ Fixed only this line — added `: { children: ReactNode }`
const LazyWrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<Loading />}>
    {children}
  </Suspense>
);

// Helper function to create route elements - ensures they're created when route is matched, not at module load
const createPublicRoute = (Component: React.ComponentType) => (
  <PublicLayout><LazyWrapper><Component /></LazyWrapper></PublicLayout>
);

export const router = createBrowserRouter([
  { path: "/", element: <PublicLayout><Home /></PublicLayout> },
  { path: "/pricing", element: createPublicRoute(Pricing) },
  { path: "/cart", element: <PublicLayout><Cart /></PublicLayout> },
  { path: "/shop", element: <PublicLayout><Shop /></PublicLayout> },
  { path: "/shop/:username", element: createPublicRoute(ShopUser) },
  { path: "/product/:productId", element: <PublicLayout><Product /></PublicLayout> },
  { path: "/bargain", element: <PublicLayout><Bargain /></PublicLayout> },
  { path: "/login", element: createPublicRoute(Login) },
  { path: "/register", element: createPublicRoute(Register) },
  { path: "/auth", element: <PublicLayout><AccountTypeSelection /></PublicLayout> },
  { 
    path: "/auth/login", 
    element: (
      <PublicLayout>
        <AuthLogin />
      </PublicLayout>
    ),
    errorElement: (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-8 text-center transition-colors duration-300">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Error loading page</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">Please try refreshing the page</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  },
  { path: "/auth/register", element: createPublicRoute(AuthRegister) },
  { path: "/auth/forgot-password", element: createPublicRoute(AuthForgot) },
  { path: "/forgot-password", element: createPublicRoute(ForgotPassword) },
  { path: "/privacy-policy", element: createPublicRoute(PrivacyPolicy) },
  { path: "/support", element: createPublicRoute(Support) },
  { path: "/seller", element: <PublicLayout><Seller /></PublicLayout> },
  { path: "/seller/login", element: <PublicLayout><SellerLogin /></PublicLayout> },
  { path: "/seller/register", element: <PublicLayout><SellerRegister /></PublicLayout> },
  { path: "/seller/dashboard", element: <PublicLayout><SellerDashboard /></PublicLayout> },
  { path: "/seller/dashboard/products", element: <PublicLayout><SellerProducts /></PublicLayout> },
  { path: "/seller/dashboard/products/add", element: <PublicLayout><SellerProductsAdd /></PublicLayout> },
  { path: "/seller/dashboard/products/edit/:id", element: <PublicLayout><SellerProductsEdit /></PublicLayout> },
  { path: "/seller/dashboard/products/view/:id", element: <PublicLayout><SellerProductsView /></PublicLayout> },
  { path: "/seller/dashboard/sales", element: <PublicLayout><SellerSales /></PublicLayout> },
  { path: "/seller/dashboard/orders", element: <PublicLayout><SellerOrders /></PublicLayout> },
  { path: "/seller/dashboard/delivery", element: <PublicLayout><SellerDelivery /></PublicLayout> },
  { path: "/seller/dashboard/delivery/schedule", element: <PublicLayout><SellerDeliverySchedule /></PublicLayout> },
  { path: "/profile", element: <PublicLayout><Profile /></PublicLayout> },
  { path: "/wishlist", element: <PublicLayout><Wishlist /></PublicLayout> },
  { path: "/orders", element: <PublicLayout><Orders /></PublicLayout> },
  { path: "/checkout", element: <PublicLayout><Checkout /></PublicLayout> },

  // Admin and Store sections (render their own layouts)
  { path: "/admin", element: <AdminRoot><LazyWrapper><AdminPage /></LazyWrapper></AdminRoot> },
  { path: "/admin/stores", element: <AdminRoot><LazyWrapper><AdminStores /></LazyWrapper></AdminRoot> },
  { path: "/admin/coupons", element: <AdminRoot><LazyWrapper><AdminCoupons /></LazyWrapper></AdminRoot> },
  { path: "/admin/approve", element: <AdminRoot><LazyWrapper><AdminApprove /></LazyWrapper></AdminRoot> },
  { path: "/store", element: <StoreRoot><LazyWrapper><StorePage /></LazyWrapper></StoreRoot> },
  { path: "/store/orders", element: <StoreRoot><LazyWrapper><StoreOrders /></LazyWrapper></StoreRoot> },
  { path: "/store/add-product", element: <StoreRoot><LazyWrapper><StoreAddProduct /></LazyWrapper></StoreRoot> },
  { path: "/store/manage-product", element: <StoreRoot><LazyWrapper><StoreManageProduct /></LazyWrapper></StoreRoot> },
]);

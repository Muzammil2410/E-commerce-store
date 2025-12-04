import { createBrowserRouter } from "react-router-dom";
// import { lazy, Suspense, ReactNode } from "react";
import React, { lazy, Suspense, type ReactNode } from "react";

import PublicLayout from "@/app/(public)/layout";
import AdminRoot from "@/app/admin/layout";
import StoreRoot from "@/app/store/layout";
import Loading from "@/components/Loading";
// Import AuthLogin directly instead of lazy loading to avoid Router context issues
import AuthLogin from "@/app/(public)/auth/login/page";

// Lazy load pages for code splitting and better performance
const Home = lazy(() => import("@/app/(public)/page"));
const Pricing = lazy(() => import("@/app/(public)/pricing/page"));
const Cart = lazy(() => import("@/app/(public)/cart/page"));
const Shop = lazy(() => import("@/app/(public)/shop/page"));
const ShopUser = lazy(() => import("@/app/(public)/shop/[username]/page"));
const Product = lazy(() => import("@/app/(public)/product/[productId]/page"));
const Login = lazy(() => import("@/app/(public)/login/page"));
const Register = lazy(() => import("@/app/(public)/register/page"));
const Profile = lazy(() => import("@/app/(public)/profile/page"));
const Orders = lazy(() => import("@/app/(public)/orders/page"));
const Checkout = lazy(() => import("@/app/(public)/checkout/page"));
const AuthRegister = lazy(() => import("@/app/(public)/auth/register/page"));
const AuthForgot = lazy(() => import("@/app/(public)/auth/forgot-password/page"));
const ForgotPassword = lazy(() => import("@/app/(public)/forgot-password/page"));
const PrivacyPolicy = lazy(() => import("@/app/(public)/privacy-policy/page"));
const Support = lazy(() => import("@/app/(public)/support/page"));
const Seller = lazy(() => import("@/app/(public)/seller/page"));
const SellerLogin = lazy(() => import("@/app/(public)/seller/login/page"));
const SellerRegister = lazy(() => import("@/app/(public)/seller/register/page"));
const SellerDashboard = lazy(() => import("@/app/(public)/seller/dashboard/page"));
const SellerProducts = lazy(() => import("@/app/(public)/seller/dashboard/products/page"));
const SellerProductsAdd = lazy(() => import("@/app/(public)/seller/dashboard/products/add/page"));
const SellerProductsEdit = lazy(() => import("@/app/(public)/seller/dashboard/products/edit/[id]/page"));
const SellerProductsView = lazy(() => import("@/app/(public)/seller/dashboard/products/view/[id]/page"));
const SellerSales = lazy(() => import("@/app/(public)/seller/dashboard/sales/page"));
const SellerOrders = lazy(() => import("@/app/(public)/seller/dashboard/orders/page"));
const SellerDelivery = lazy(() => import("@/app/(public)/seller/dashboard/delivery/page"));
const SellerDeliverySchedule = lazy(() => import("@/app/(public)/seller/dashboard/delivery/schedule/page"));
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
  { path: "/", element: createPublicRoute(Home) },
  { path: "/pricing", element: createPublicRoute(Pricing) },
  { path: "/cart", element: createPublicRoute(Cart) },
  { path: "/shop", element: createPublicRoute(Shop) },
  { path: "/shop/:username", element: createPublicRoute(ShopUser) },
  { path: "/product/:productId", element: createPublicRoute(Product) },
  { path: "/login", element: createPublicRoute(Login) },
  { path: "/register", element: createPublicRoute(Register) },
  { 
    path: "/auth/login", 
    element: (
      <PublicLayout>
        <AuthLogin />
      </PublicLayout>
    ),
    errorElement: (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error loading page</h1>
          <p className="text-gray-600 mb-6">Please try refreshing the page</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
  { path: "/seller", element: createPublicRoute(Seller) },
  { path: "/seller/login", element: createPublicRoute(SellerLogin) },
  { path: "/seller/register", element: createPublicRoute(SellerRegister) },
  { path: "/seller/dashboard", element: createPublicRoute(SellerDashboard) },
  { path: "/seller/dashboard/products", element: createPublicRoute(SellerProducts) },
  { path: "/seller/dashboard/products/add", element: createPublicRoute(SellerProductsAdd) },
  { path: "/seller/dashboard/products/edit/:id", element: createPublicRoute(SellerProductsEdit) },
  { path: "/seller/dashboard/products/view/:id", element: createPublicRoute(SellerProductsView) },
  { path: "/seller/dashboard/sales", element: createPublicRoute(SellerSales) },
  { path: "/seller/dashboard/orders", element: createPublicRoute(SellerOrders) },
  { path: "/seller/dashboard/delivery", element: createPublicRoute(SellerDelivery) },
  { path: "/seller/dashboard/delivery/schedule", element: createPublicRoute(SellerDeliverySchedule) },
  { path: "/profile", element: createPublicRoute(Profile) },
  { path: "/orders", element: createPublicRoute(Orders) },
  { path: "/checkout", element: createPublicRoute(Checkout) },

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

import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import PublicLayout from "@/app/(public)/layout";
import AdminRoot from "@/app/admin/layout";
import StoreRoot from "@/app/store/layout";
import Loading from "@/components/Loading";

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
const AuthLogin = lazy(() => import("@/app/(public)/auth/login/page"));
const AuthRegister = lazy(() => import("@/app/(public)/auth/register/page"));
const AuthForgot = lazy(() => import("@/app/(public)/auth/forgot-password/page"));
const ForgotPassword = lazy(() => import("@/app/(public)/forgot-password/page"));
const PrivacyPolicy = lazy(() => import("@/app/(public)/privacy-policy/page"));
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
const AdminPage = lazy(() => import("@/app/admin/page"));
const AdminStores = lazy(() => import("@/app/admin/stores/page"));
const AdminCoupons = lazy(() => import("@/app/admin/coupons/page"));
const AdminApprove = lazy(() => import("@/app/admin/approve/page"));
const StorePage = lazy(() => import("@/app/store/page"));
const StoreOrders = lazy(() => import("@/app/store/orders/page"));
const StoreAddProduct = lazy(() => import("@/app/store/add-product/page"));
const StoreManageProduct = lazy(() => import("@/app/store/manage-product/page"));

// Wrapper component for Suspense
const LazyWrapper = ({ children }) => (
  <Suspense fallback={<Loading />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  { path: "/", element: <PublicLayout><LazyWrapper><Home /></LazyWrapper></PublicLayout> },
  { path: "/pricing", element: <PublicLayout><LazyWrapper><Pricing /></LazyWrapper></PublicLayout> },
  { path: "/cart", element: <PublicLayout><LazyWrapper><Cart /></LazyWrapper></PublicLayout> },
  { path: "/shop", element: <PublicLayout><LazyWrapper><Shop /></LazyWrapper></PublicLayout> },
  { path: "/shop/:username", element: <PublicLayout><LazyWrapper><ShopUser /></LazyWrapper></PublicLayout> },
  { path: "/product/:productId", element: <PublicLayout><LazyWrapper><Product /></LazyWrapper></PublicLayout> },
  { path: "/login", element: <PublicLayout><LazyWrapper><Login /></LazyWrapper></PublicLayout> },
  { path: "/register", element: <PublicLayout><LazyWrapper><Register /></LazyWrapper></PublicLayout> },
  { path: "/auth/login", element: <PublicLayout><LazyWrapper><AuthLogin /></LazyWrapper></PublicLayout> },
  { path: "/auth/register", element: <PublicLayout><LazyWrapper><AuthRegister /></LazyWrapper></PublicLayout> },
  { path: "/auth/forgot-password", element: <PublicLayout><LazyWrapper><AuthForgot /></LazyWrapper></PublicLayout> },
  { path: "/forgot-password", element: <PublicLayout><LazyWrapper><ForgotPassword /></LazyWrapper></PublicLayout> },
  { path: "/privacy-policy", element: <PublicLayout><LazyWrapper><PrivacyPolicy /></LazyWrapper></PublicLayout> },
  { path: "/seller", element: <PublicLayout><LazyWrapper><Seller /></LazyWrapper></PublicLayout> },
  { path: "/seller/login", element: <PublicLayout><LazyWrapper><SellerLogin /></LazyWrapper></PublicLayout> },
  { path: "/seller/register", element: <PublicLayout><LazyWrapper><SellerRegister /></LazyWrapper></PublicLayout> },
  { path: "/seller/dashboard", element: <PublicLayout><LazyWrapper><SellerDashboard /></LazyWrapper></PublicLayout> },
  { path: "/seller/dashboard/products", element: <PublicLayout><LazyWrapper><SellerProducts /></LazyWrapper></PublicLayout> },
  { path: "/seller/dashboard/products/add", element: <PublicLayout><LazyWrapper><SellerProductsAdd /></LazyWrapper></PublicLayout> },
  { path: "/seller/dashboard/products/edit/:id", element: <PublicLayout><LazyWrapper><SellerProductsEdit /></LazyWrapper></PublicLayout> },
  { path: "/seller/dashboard/products/view/:id", element: <PublicLayout><LazyWrapper><SellerProductsView /></LazyWrapper></PublicLayout> },
  { path: "/seller/dashboard/sales", element: <PublicLayout><LazyWrapper><SellerSales /></LazyWrapper></PublicLayout> },
  { path: "/seller/dashboard/orders", element: <PublicLayout><LazyWrapper><SellerOrders /></LazyWrapper></PublicLayout> },
  { path: "/profile", element: <PublicLayout><LazyWrapper><Profile /></LazyWrapper></PublicLayout> },
  { path: "/orders", element: <PublicLayout><LazyWrapper><Orders /></LazyWrapper></PublicLayout> },
  { path: "/checkout", element: <PublicLayout><LazyWrapper><Checkout /></LazyWrapper></PublicLayout> },
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



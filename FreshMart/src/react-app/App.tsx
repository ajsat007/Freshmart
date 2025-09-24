import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import { CartProvider } from "@/react-app/context/CartContext";
import Navbar from "@/react-app/components/Navbar";
import HomePage from "@/react-app/pages/Home";
import ProductsPage from "@/react-app/pages/Products";
import ProductDetailPage from "@/react-app/pages/ProductDetail";
import CartPage from "@/react-app/pages/Cart";
import CheckoutPage from "@/react-app/pages/Checkout";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import ProfilePage from "@/react-app/pages/Profile";
import OrdersPage from "@/react-app/pages/Orders";
import AdminPage from "@/react-app/pages/Admin";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

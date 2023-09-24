import { Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomeLayout from "./layouts/homeLayout/HomeLayout";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Home from "./pages/home/Home";
import { getUser } from "./features/user/userSlice";
// import { getOrders } from "./features/seller/sellerSlice";
import SellerLayout from "./layouts/sellerLayout/SellerLayout";
import SellerHome from "./pages/seller/home/SellerHome";
import AddProduct from "./pages/seller/addProduct/AddProduct";
import { getProducts } from "./features/seller/sellerSlice";
import SellerProduct from "./pages/seller/product/Product";
import ProductSearch from "./pages/productSearch/ProductSearch";
import SellerProductSearch from "./pages/seller/productSearch/ProductSearch";
import Product from "./pages/product/Product";
import UserLayout from "./layouts/userLayout/UserLayout";
import UserHome from "./pages/user/home/Home";
import UserOrders from "./pages/user/orders/Orders";
import Liked from "./pages/user/liked/Liked";
import UserSettings from "./pages/user/settings/Settings";
import Checkout from "./pages/checkout/Checkout";
import StripePayment from "./pages/stripePayment/StripePayment";
import PaymentSuccess from "./pages/paymentSuccess/PaymentSuccess";
import Restaurant from "./pages/restaurant/Restaurant";
import { fetchSellerOrders } from "./features/order/orderSlice";

function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUser()).then((res) => {
        if (res.payload.success) {
          if (res.payload.data.role === "seller") {
            dispatch(fetchSellerOrders());
            // dispatch(getProducts(""));
          }
          if (res.payload.data.role === "admin") {
            navigate("/admin");
          }
        }
      });
    }
  }, [isLoggedIn]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomeLayout />}>
          <Route index={true} element={<Home />} />
          <Route path="productsearch" element={<ProductSearch />} />
          <Route path="products/:id" element={<Product />} />
          <Route path="restaurant/:id" element={<Restaurant />} />
          <Route path="payment/success" element={<PaymentSuccess />} />
          <Route path="orders" element={<UserOrders />} />
          <Route path="liked" element={<Liked />} />
          <Route path="settings" element={<UserSettings />} />
        </Route>
        <Route path="/seller" element={<SellerLayout />}>
          <Route index={true} element={<SellerHome />} />
          <Route path="add" element={<AddProduct />} />
          <Route path="productsearch" element={<SellerProductSearch />} />
          <Route path="products/:id" element={<SellerProduct />} />
          <Route path="settings" element={<UserSettings />} />
        </Route>
        <Route path="/profile" element={<UserLayout />}>
          <Route index={true} element={<UserHome />} />
          <Route path="checkout/:id" element={<Checkout />} />
          <Route path="payment" element={<StripePayment />} />
          <Route path="productsearch" element={<ProductSearch />} />
          <Route path="products/:id" element={<Product />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

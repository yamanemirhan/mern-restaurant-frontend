import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

export default function SellerLayout() {
  const navigate = useNavigate();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user, isSuccess } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
    if (isSuccess) {
      if (!isLoggedIn || user?.role !== "seller") {
        navigate("/");
        console.log("a");
      }
    }
  }, [user, navigate, isLoggedIn, isSuccess]);

  return (
    <div className="container">
      <div className="wrapper">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}

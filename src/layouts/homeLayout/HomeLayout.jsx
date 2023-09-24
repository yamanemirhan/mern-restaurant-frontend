import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { useSelector } from "react-redux";

export default function HomeLayout() {
  const navigate = useNavigate();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user, isSuccess } = useSelector((state) => state.user);

  useEffect(() => {
    if (isSuccess) {
      if (isLoggedIn && user.role === "seller") {
        navigate("/seller");
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

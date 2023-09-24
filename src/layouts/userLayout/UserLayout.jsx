import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { useSelector } from "react-redux";

export default function UserLayout() {
  const navigate = useNavigate();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "user") {
      navigate("/");
    }
  }, [user, navigate]);

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

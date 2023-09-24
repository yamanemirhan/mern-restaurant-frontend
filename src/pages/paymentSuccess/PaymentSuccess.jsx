import React, { useEffect } from "react";
import styles from "./paymentSuccess.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PaymentSuccess() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <div className={styles.paymentSuccessContainer}>
      <h1 className={styles.orderSuccess}>
        The product was successfully ordered!
      </h1>
      <p className={styles.checkOrders}>
        Go to my{" "}
        <Link to={"/orders"} replace={true}>
          ORDERS
        </Link>{" "}
        page
      </p>
    </div>
  );
}

export default PaymentSuccess;

import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import styles from "./stripePayment.module.css";

function StripePayment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  const { currentOrder } = useSelector((state) => state.order);

  useEffect(() => {
    fetch("https://mern-restaurant-3hw5.onrender.com/config").then(
      async (r) => {
        const { publishableKey } = await r.json();
        setStripePromise(loadStripe(publishableKey));
      }
    );
  }, []);

  useEffect(() => {
    fetch("https://mern-restaurant-3hw5.onrender.com/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: currentOrder?.amount,
        orderId: currentOrder?._id,
      }),
    }).then(async (result) => {
      var { clientSecret } = await result.json();
      setClientSecret(clientSecret);
    });
  }, []);

  return (
    <div className={styles.container}>
      <h1>Payment</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}

export default StripePayment;

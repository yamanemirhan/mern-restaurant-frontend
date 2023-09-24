import React, { useState } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import styles from "./checkoutForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteOrder } from "../../features/order/orderSlice";
import { useNavigate } from "react-router-dom";
import newToast from "../../services/toast";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { currentOrder } = useSelector((state) => state.order);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `http://localhost:5173/payment/success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      dispatch(deleteOrder(currentOrder._id));
      setMessage(error.message);
      newToast(error.message, "red");
      navigate(-1);
    } else {
      dispatch(deleteOrder(currentOrder._id));
      setMessage("An unexpected error occured.");
      newToast("An unexpected error occured.", "red");
      navigate(-1);
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        className={styles.payBtn}
      >
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}

export default CheckoutForm;

import React from "react";
import styles from "./orderReviewModal.module.css";
import { AiFillStar } from "react-icons/ai";

function OrderReviewModal({ order, onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
        <h4>Review</h4>
        <div>
          {[...Array(order.review.givenStar)].map((_, index) => (
            <AiFillStar key={index} size={24} color="gold" />
          ))}
        </div>
        <p>{order.review.text}</p>
      </div>
    </div>
  );
}

export default OrderReviewModal;

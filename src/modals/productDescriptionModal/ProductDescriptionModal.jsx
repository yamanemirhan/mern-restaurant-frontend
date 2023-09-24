import React from "react";
import styles from "./productDescriptionModal.module.css";

function ProductDescriptionModal({ description, onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
        <h4>Description</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default ProductDescriptionModal;

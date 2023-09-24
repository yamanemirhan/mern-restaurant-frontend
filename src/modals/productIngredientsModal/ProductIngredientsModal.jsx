import React from "react";
import styles from "./productIngredientsModal.module.css";

function ProductIngredientsModal({ ingredients, onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>

        <h4>Ingredients</h4>
        <ul>
          {ingredients.map((ingredient, i) => (
            <li key={i}>- {ingredient}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProductIngredientsModal;

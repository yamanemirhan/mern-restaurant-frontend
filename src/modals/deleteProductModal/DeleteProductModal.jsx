import React from "react";
import styles from "./deleteProductModal.module.css";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../features/seller/sellerSlice";
import { useNavigate } from "react-router-dom";

function DeleteProductModal({ product, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(deleteProduct(product._id));
    navigate("/seller/productsearch");
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
        <h4>Delete Product</h4>
        <div>Are you sure to delete this product?</div>
        <button onClick={handleSubmit} className={styles.confirmDeleteBtn}>
          Yes
        </button>
      </div>
    </div>
  );
}

export default DeleteProductModal;

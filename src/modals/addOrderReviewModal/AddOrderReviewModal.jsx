import React, { useState } from "react";
import styles from "./addOrderReviewModal.module.css";
import { addCommentAPI } from "../../features/order/orderService";
import { AiFillStar } from "react-icons/ai";
import newToast from "../../services/toast";

function AddOrderReviewModal({ order, onClose, setIsReviewAdded }) {
  const [formData, setFormData] = useState({
    star: null,
    text: "",
  });
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(null);

  const handleStarHover = (starIndex) => {
    setHoveredStar(starIndex);
  };

  const handleStarClick = (starIndex) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      star: starIndex + 1,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      star: formData.star - 1,
      text: formData.text,
      productId: order.item._id,
      orderId: order._id,
    };

    if (data.star == -1) {
      return newToast("Please give it a star.", "red");
    }

    try {
      setLoading(true);
      const response = await addCommentAPI(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      setIsReviewAdded(true);
      setLoading(false);
      onClose();
    } catch (error) {
      newToast(error.message, "red");
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
        <h4>Add a Review</h4>
        <form onSubmit={handleSubmit} className={styles.addReviewForm}>
          <div className={styles.reviewStars}>
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <AiFillStar
                key={starIndex}
                size={30}
                onMouseEnter={() => handleStarHover(starIndex)}
                onMouseLeave={() => handleStarHover(null)}
                onClick={() => handleStarClick(starIndex)}
                className={
                  starIndex <=
                  (hoveredStar !== null ? hoveredStar : formData.star - 1)
                    ? styles.starActive
                    : styles.starInactive
                }
              />
            ))}
          </div>
          <textarea
            type="text"
            rows={4}
            placeholder="Comment..."
            name="text"
            required
            onChange={handleChange}
          />
          <button disabled={loading} className={styles.sendReviewBtn}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddOrderReviewModal;

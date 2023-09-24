import React, { useState } from "react";
import styles from "./updateProductModal.module.css";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../features/seller/sellerSlice";
import { useNavigate } from "react-router-dom";

function UpdateProductModal({ product, onClose }) {
  const [formData, setFormData] = useState({
    name: product.name,
    ingredients: product.ingredients,
    product_image: "",
    category: product.category,
    price: product.price,
    desc: product.desc,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeUpdateModal = () => {
    onClose();
    setFormData({
      name: product.name,
      desc: product.desc,
      price: product.price,
      stock: product.stock,
      product_image: product.img,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      product_image: file,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("product_image", formData.product_image);

    const productData = {
      name: formData.name,
      ingredients: formData.ingredients,
      desc: formData.desc,
      price: formData.price,
      category: formData.category,
    };
    data.append("productData", JSON.stringify(productData));

    dispatch(updateProduct({ data, id: product._id }));
    // navigate("/seller/productsearch");
    closeUpdateModal();
  };

  const handleIngredientChange = (e, index) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = e.target.value;
    setFormData({
      ...formData,
      ingredients: newIngredients,
    });
  };

  const addIngredientField = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ""],
    });
  };

  const removeIngredientField = (index) => {
    const newIngredients = [...formData.ingredients];
    newIngredients.splice(index, 1);
    setFormData({
      ...formData,
      ingredients: newIngredients,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>

        <h4>Update Product</h4>
        <form onSubmit={handleSubmit} className={styles.addProductForm}>
          <div className={styles.formElement}>
            <label>Name:</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.addIngredient}>
            <div className={styles.formElement}>
              <label>Ingredients:</label>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index}>
                  <input
                    required
                    type="text"
                    name={`ingredients[${index}]`}
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(e, index)}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeIngredientField(index)}
                      className={styles.removeIngredientBtn}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredientField}
              className={styles.addIngredientBtn}
            >
              Add Ingredient
            </button>
          </div>
          <div className={styles.formElement}>
            <label className={styles.label}>Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formElement}>
            <label>Category:</label>
            <input
              required
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formElement}>
            <label>Price:</label>
            <input
              required
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formElement}>
            <label>Description:</label>
            <textarea
              required
              rows={4}
              name="desc"
              value={formData.desc}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className={styles.updateProductBtn}>
            UPDATE
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProductModal;

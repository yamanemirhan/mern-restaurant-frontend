import React, { useState } from "react";
import styles from "./addProduct.module.css";
import { useDispatch } from "react-redux";
import { addProduct } from "../../../features/seller/sellerSlice";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    ingredients: [""],
    product_image: null,
    category: "",
    price: "",
    desc: "",
  });

  const dispatch = useDispatch();

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

    dispatch(addProduct(data));

    setFormData({
      name: "",
      ingredients: [""],
      product_image: null,
      category: "",
      price: "",
      desc: "",
    });

    resetFileInput();
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

  const resetFileInput = () => {
    const fileInput = document.getElementById("product-image");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add Product</h2>
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
            id="product-image"
            required
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
        <button type="submit" className={styles.addProductBtn}>
          ADD
        </button>
      </form>
    </div>
  );
}

export default AddProduct;

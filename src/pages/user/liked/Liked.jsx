import React, { useEffect, useState } from "react";
import styles from "./liked.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getLikedProducts } from "../../../features/product/productService";
import newToast from "../../../services/toast";
import ProductCard from "../../../components/productCard/ProductCard";

function Liked() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getLikedProducts();
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        setProducts(result.data);
        setLoading(false);
      } catch (error) {
        newToast(error.message, "red");
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.likedProductsCount]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <div className={styles.container}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Liked Products</h1>
          <div className={styles.likedProducts}>
            {products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Liked;

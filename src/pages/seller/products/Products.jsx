import React from "react";
import styles from "./products.module.css";
import { useSelector } from "react-redux";
import ProductCard from "../../../components/seller/productCard/ProductCard";

function Products() {
  const { products } = useSelector((state) => state.seller);

  return (
    <div className={styles.container}>
      {products?.length ? (
        <>
          <div className={styles.products}>
            {products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <h2>You don't have any products</h2>
      )}
    </div>
  );
}

export default Products;

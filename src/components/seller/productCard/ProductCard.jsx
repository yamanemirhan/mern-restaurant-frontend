import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./productCard.module.css";
import { AiTwotoneStar, AiTwotoneHeart, AiOutlineDelete } from "react-icons/ai";
import { BiCommentDots, BiEdit } from "react-icons/bi";
import UpdateProductModal from "../../../modals/updateProductModal/UpdateProductModal";
import DeleteProductModal from "../../../modals/deleteProductModal/DeleteProductModal";

function ProductCard({ product }) {
  const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] =
    useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState(false);

  const closeModal = () => {
    setIsUpdateProductModalOpen(false);
    setIsDeleteProductModalOpen(false);
  };

  const handleUpdateProductIcon = (e) => {
    e.preventDefault();
    setIsUpdateProductModalOpen(true);
  };

  const handleDeleteProductIcon = (e) => {
    e.preventDefault();
    setIsDeleteProductModalOpen(true);
  };

  return (
    <>
      <Link
        to={`/seller/products/${product._id}`}
        className={styles.cardContainer}
      >
        <div className={styles.productImgContainer}>
          <img
            src={`${import.meta.env.VITE_APP_API_BASE_URL}/images/${
              product?.img
            }`}
            alt="user"
            className={styles.productImg}
          />
        </div>

        <div className={styles.productInfo}>
          <div className={styles.productHead}>
            <h3>{product.name}</h3>
            {product?.star && (
              <span className={styles.productStar}>
                <AiTwotoneStar size={30} color="yellow" />
                {product.star}
                <span>({product?.comments?.length})</span>
              </span>
            )}
          </div>
          <span className={styles.productCat}>{product.category}</span>
          <p>
            {product.desc.length > 40
              ? `${product.desc.slice(0, 40)}...`
              : product.desc}
          </p>
          <span className={styles.productPrice}>${product?.price}</span>
        </div>
        <div className={styles.cardBottom}>
          <div className={styles.sellerInfo}>
            {product?.seller.profilePicture ? (
              <img
                src={`${import.meta.env.VITE_APP_API_BASE_URL}/images/${
                  product?.seller.profilePicture
                }`}
                alt="user"
                className={styles.sellerImg}
              />
            ) : (
              <img
                src="https://avatars.mds.yandex.net/i?id=438af819eb4449ee36013e85faf8758151cbbc2e-9066083-images-thumbs&n=13"
                alt="user"
                className={styles.sellerImg}
              />
            )}
            <span>{product.seller.company}</span>
          </div>
          <div className={styles.productIcons}>
            <div className={styles.productIcon}>
              <AiTwotoneHeart size={20} color="red" />
              {product.likes.length}
            </div>
            <div className={styles.productIcon}>
              <BiCommentDots size={20} color="blue" />
              {product.comments.length}
            </div>
          </div>
        </div>
        <div className={styles.productActions}>
          <div onClick={handleUpdateProductIcon}>
            <BiEdit size={30} color="blue" />
          </div>
          <div onClick={handleDeleteProductIcon}>
            <AiOutlineDelete size={30} color="red" />
          </div>
        </div>
      </Link>

      {isUpdateProductModalOpen && (
        <UpdateProductModal product={product} onClose={closeModal} />
      )}
      {isDeleteProductModalOpen && (
        <DeleteProductModal product={product} onClose={closeModal} />
      )}
    </>
  );
}

export default ProductCard;

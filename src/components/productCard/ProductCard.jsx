import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./productCard.module.css";
import { AiTwotoneStar, AiTwotoneHeart } from "react-icons/ai";
import { BiCommentDots } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { likeProduct } from "../../features/user/userSlice";
import newToast from "../../services/toast";

function ProductCard({ product, isOrdering = false }) {
  const [isLiked, setIsLiked] = useState(false);
  const [orderAmount, setOrderAmount] = useState(1);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.likedProducts && product) {
      const isProductLiked = user.likedProducts.some(
        (id) => id === product._id
      );
      setIsLiked(isProductLiked);
    }
  }, [user, product]);

  const handleLikeProduct = (e) => {
    e.preventDefault();

    if (!user) {
      return newToast("You must log in to like the product!", "red");
    }

    setIsLiked((prevValue) => !prevValue);
    dispatch(likeProduct(product._id));
  };

  return (
    <Link to={`/products/${product?._id}`} className={styles.cardContainer}>
      <div className={styles.productImgContainer}>
        {product?.img && (
          <img
            src={`${import.meta.env.VITE_APP_API_BASE_URL}/images/${
              product?.img
            }`}
            alt="user"
            className={styles.productImg}
          />
        )}
      </div>
      <div className={styles.productInfo}>
        <div className={styles.productHead}>
          <h3>{product?.name}</h3>
          {product?.star && (
            <span className={styles.productStar}>
              <AiTwotoneStar size={30} color="yellow" />
              {product?.star} ({product?.comments?.length})
            </span>
          )}
        </div>
        <span className={styles.productCat}>{product?.category}</span>
        <p>
          {product?.desc.length > 40
            ? `${product?.desc.slice(0, 40)}...`
            : product?.desc}
        </p>
        <span className={styles.productPrice}>${product?.price}</span>
      </div>
      <div className={styles.cardBottom}>
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate(`/restaurant/${product?.seller?.id}`);
          }}
          className={styles.sellerInfo}
        >
          {product?.seller?.profilePicture ? (
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
          <span>{product?.seller.company}</span>
        </button>
        <div className={styles.productIcons}>
          <div className={styles.productIcon}>
            <AiTwotoneHeart
              size={25}
              color={`${isLiked ? "red" : "gray"}`}
              onClick={handleLikeProduct}
            />
          </div>
          <div className={styles.productIcon}>
            <BiCommentDots size={25} color="blue" />
            {product?.comments.length}
          </div>
        </div>
      </div>
      <div>
        {isLoggedIn ? (
          <div className={styles.productOrderInfo}>
            {!isOrdering && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/profile/checkout/${product?._id}`);
                }}
                className={styles.orderBtn}
              >
                Order Now!
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            className={styles.loginToOrderBtn}
          >
            Log In to Order!
          </button>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;

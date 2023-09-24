import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./product.module.css";
import { getProductAPI } from "../../features/product/productService";
import { AiTwotoneStar, AiTwotoneHeart, AiOutlineDelete } from "react-icons/ai";
import { BiCommentDots, BiEdit } from "react-icons/bi";
import newToast from "../../services/toast";
import ProductDescriptionModal from "../../modals/productDescriptionModal/ProductDescriptionModal";
import ProductIngredientsModal from "../../modals/productIngredientsModal/ProductIngredientsModal";
import Comments from "../../components/comments/Comments";
import { useDispatch, useSelector } from "react-redux";
import { likeProduct } from "../../features/user/userSlice";

function Product() {
  const [product, setProduct] = useState();
  const [comments, setComments] = useState();
  const [loading, setLoading] = useState(false);
  const [showFullIngredients, setShowFullIngredients] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [isLiked, setIsLiked] = useState(false);
  const [orderAmount, setOrderAmount] = useState(1);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const openIngredientsModal = () => {
    setShowFullIngredients(!showFullIngredients);
    setIsIngredientsModalOpen(true);
    setIsDescriptionModalOpen(false);
  };
  const openDescriptionModal = () => {
    setShowFullDescription(!showFullDescription);
    setIsDescriptionModalOpen(true);
    setIsIngredientsModalOpen(false);
  };

  const closeModal = () => {
    setIsDescriptionModalOpen(false);
    setIsIngredientsModalOpen(false);
    setShowFullIngredients(false);
    setShowFullDescription(false);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getProductAPI(id);
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        setProduct(result.data.product);
        setComments(result.data.comments);
        setLoading(false);
      } catch (error) {
        newToast(error.message, "red");
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.productLoading}>Loading...</div>
      ) : (
        <div className={styles.product}>
          {product?.img && (
            <img
              src={`${import.meta.env.VITE_APP_API_BASE_URL}/images/${
                product?.img
              }`}
              alt="user"
              className={styles.productImage}
            />
          )}
          <h2>{product?.name}</h2>
          <span className={styles.productCategory}>{product?.category}</span>
          <div className={styles.productActions}>
            <div className={styles.productIcon}>
              <AiTwotoneHeart
                size={30}
                color={`${isLiked ? "red" : "gray"}`}
                onClick={handleLikeProduct}
              />
            </div>
            <div>
              <BiCommentDots size={30} color="blue" />{" "}
              {product?.comments.length}
            </div>
          </div>
          <span className={styles.productPrice}>${product?.price}</span>
          <div>
            {isLoggedIn ? (
              <div className={styles.productOrderInfo}>
                <button className={styles.orderBtn}>
                  <Link to={`/profile/checkout/${product?._id}`}>
                    Order Now!
                  </Link>
                </button>
              </div>
            ) : (
              <button className={styles.loginToOrderBtn}>
                <Link to={"/login"}>Log In to Order!</Link>
              </button>
            )}
          </div>
          <div className={styles.productInfos}>
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate(`/restaurant/${product?.seller?.id}`);
              }}
              className={styles.productSellerInfo}
            >
              {product?.seller.profilePicture ? (
                <img
                  src={`${import.meta.env.VITE_APP_API_BASE_URL}/images/${
                    product?.seller.profilePicture
                  }`}
                  alt="user"
                />
              ) : (
                <img
                  src="https://avatars.mds.yandex.net/i?id=438af819eb4449ee36013e85faf8758151cbbc2e-9066083-images-thumbs&n=13"
                  alt="user"
                />
              )}
              {product?.seller.company || "techno fest"}
            </button>
            {product?.star && (
              <div className={styles.starRating}>
                <AiTwotoneStar color="yellow" size={30} />
                {product?.star}
                <span>({product?.comments?.length})</span>
              </div>
            )}
          </div>
          <div className={styles.productDetail}>
            <div className={styles.ingredientInfo}>
              <h4>Ingredients</h4>
              <ul>
                {product?.ingredients.map((ingredient, i) => (
                  <li key={i}>- {ingredient}</li>
                ))}
              </ul>
              {!showFullIngredients && (
                <button
                  className={styles.showMoreBtn}
                  onClick={openIngredientsModal}
                >
                  Read more
                </button>
              )}
            </div>
            <div className={styles.descriptionInfo}>
              <h4>Description</h4>
              <p>{product?.desc}</p>
              {!showFullDescription && (
                <button
                  className={styles.showMoreBtn}
                  onClick={openDescriptionModal}
                >
                  Read more
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {showFullIngredients && isIngredientsModalOpen && (
        <ProductIngredientsModal
          ingredients={product?.ingredients}
          onClose={closeModal}
        />
      )}
      {showFullDescription && isDescriptionModalOpen && (
        <ProductDescriptionModal
          description={product?.desc}
          onClose={closeModal}
        />
      )}

      {comments?.length !== 0 && (
        <div className={styles.commentsInfo}>
          <div>
            {!product?.star && (
              <div className={styles.starRating}>
                <AiTwotoneStar color="yellow" size={30} />
                {product?.star}
                <span>({product?.comments?.length})</span>
              </div>
            )}
          </div>
          <select
            className={styles.commentSortSelect}
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      )}

      {/* COMMENTS */}
      <div>
        <Comments comments={comments} sortOption={sortOption} />
      </div>
    </div>
  );
}

export default Product;

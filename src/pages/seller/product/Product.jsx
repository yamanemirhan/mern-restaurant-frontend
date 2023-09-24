import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./product.module.css";
import { useSelector } from "react-redux";
import { getProductAPI } from "../../../features/product/productService";
import { AiTwotoneStar, AiTwotoneHeart, AiOutlineDelete } from "react-icons/ai";
import { BiCommentDots, BiEdit } from "react-icons/bi";
import newToast from "../../../services/toast";
import ProductDescriptionModal from "../../../modals/productDescriptionModal/ProductDescriptionModal";
import ProductIngredientsModal from "../../../modals/productIngredientsModal/ProductIngredientsModal";
import Comments from "../../../components/comments/Comments";
import UpdateProductModal from "../../../modals/updateProductModal/UpdateProductModal";
import DeleteProductModal from "../../../modals/deleteProductModal/DeleteProductModal";

function Product() {
  const [product, setProduct] = useState();
  const [comments, setComments] = useState();
  const [loading, setLoading] = useState(false);
  const [showFullIngredients, setShowFullIngredients] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] =
    useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState(false);

  const { isSuccess } = useSelector((state) => state.seller);

  const { id } = useParams();
  const navigate = useNavigate();

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
    setIsUpdateProductModalOpen(false);
    setIsDeleteProductModalOpen(false);
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
  }, [id, navigate, isSuccess]);

  const handleUpdateProductIcon = (e) => {
    e.preventDefault();
    setIsUpdateProductModalOpen(true);
  };

  const handleDeleteProductIcon = (e) => {
    e.preventDefault();
    setIsDeleteProductModalOpen(true);
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.productLoading}>Loading...</div>
      ) : product ? (
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
          <div className={styles.productLikeComment}>
            <div>
              <AiTwotoneHeart size={30} color="red" /> {product?.likes.length}
            </div>
            <div>
              <BiCommentDots size={30} color="blue" />{" "}
              {product?.comments.length}
            </div>
          </div>
          <span className={styles.productPrice}>${product?.price}</span>
          <div className={styles.productActions}>
            <div onClick={handleUpdateProductIcon}>
              <BiEdit size={50} color="blue" />
            </div>
            <div onClick={handleDeleteProductIcon}>
              <AiOutlineDelete size={50} color="red" />
            </div>
          </div>
          <div className={styles.productInfos}>
            <div className={styles.productSellerInfo}>
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
              {product?.seller.company}
            </div>
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
      ) : (
        <div>Product Not Found</div>
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
      {isUpdateProductModalOpen && (
        <UpdateProductModal product={product} onClose={closeModal} />
      )}
      {isDeleteProductModalOpen && (
        <DeleteProductModal product={product} onClose={closeModal} />
      )}
      {/* COMMENTS */}
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Comments comments={comments} sortOption={sortOption} />
        )}
      </div>
    </div>
  );
}

export default Product;

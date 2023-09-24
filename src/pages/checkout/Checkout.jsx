import React, { useEffect, useState } from "react";
import styles from "./checkout.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { getProductAPI } from "../../features/product/productService";
import { useDispatch, useSelector } from "react-redux";
import newToast from "../../services/toast";
import ProductCard from "../../components/productCard/ProductCard";
import {
  createOrder,
  decreaseQuantityOrder,
  increaseQuantityOrder,
} from "../../features/order/orderSlice";

function Checkout() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState();
  const [orderDesc, setOrderDesc] = useState("");

  const { currentQuantity } = useSelector((state) => state.order);
  const { isLoggedIn } = useSelector((state) => state.auth);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        setLoading(false);
      } catch (error) {
        newToast(error.message, "red");
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleIncreaseQuantity = () => {
    if (currentQuantity < 9) {
      dispatch(increaseQuantityOrder());
    }
  };
  const handleDecreaseQuantity = () => {
    if (currentQuantity > 1) {
      dispatch(decreaseQuantityOrder());
    }
  };

  const handleGoToPayment = () => {
    const order = {
      item: product?._id,
      quantity: currentQuantity,
      amount: product?.price * currentQuantity,
      desc: orderDesc,
    };
    dispatch(createOrder(order)).then((res) => {
      if (res.payload.success) {
        navigate(`/profile/payment`);
      }
    });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.container}>
          <h1 className={styles.orderTitle}>Order</h1>
          <div className={styles.orderProductCard}>
            <ProductCard product={product} isOrdering={true} />
          </div>
          <div className={styles.quantityInfo}>
            <button onClick={handleDecreaseQuantity}>-</button>
            <span>{currentQuantity}</span>
            <button onClick={handleIncreaseQuantity}>+</button>
          </div>

          <div className={styles.orderDesc}>
            <textarea
              name="desc"
              rows={5}
              placeholder="Write order note..."
              onChange={(e) => setOrderDesc(e.target.value)}
            />
          </div>

          <div className={styles.goToPaymentBtn}>
            <button onClick={handleGoToPayment}>Go to Payment</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;

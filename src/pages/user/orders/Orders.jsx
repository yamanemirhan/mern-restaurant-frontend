import React, { useEffect, useState } from "react";
import styles from "./orders.module.css";
import { fetchUserOrdersAPI } from "../../../features/order/orderService";
import newToast from "../../../services/toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiMessageAdd } from "react-icons/bi";
import { AiFillEye } from "react-icons/ai";
import AddOrderReviewModal from "../../../modals/addOrderReviewModal/AddOrderReviewModal";
import OrderReviewModal from "../../../modals/orderReviewModal/OrderReviewModal";

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isReviewAdded, setIsReviewAdded] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchUserOrdersAPI();
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        setOrders(result.data);
        setLoading(false);
      } catch (error) {
        newToast(error.message, "red");
        setLoading(false);
      }
    };
    fetchData();
  }, [isReviewAdded]);

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, options);
  };

  const closeModal = () => {
    setShowAddReviewModal(false);
    setShowReviewModal(false);
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Orders</h1>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th className={styles.hideInfo}>ID</th>
                <th className={styles.hideInfo}>Date</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Description</th>
                <th>Status</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                >
                  <td className={styles.hideInfo}>{order._id}</td>
                  <td className={styles.hideInfo}>
                    {formatDate(order.createdAt)}
                  </td>
                  <td
                    onClick={() => {
                      if (order.item?._id)
                        navigate(`/products/${order.item?._id}`);
                    }}
                    className={styles.orderProductName}
                  >
                    {order.item?.name || "Product deleted"}
                  </td>
                  <td>${order.amount}</td>
                  <td>{order.quantity}</td>
                  <td>{order.desc}</td>
                  <td className={styles.orderStatus}>{order.status}</td>
                  <td>
                    {order.status === "Delivered" && !order.review && (
                      <BiMessageAdd
                        className={styles.addOrderReview}
                        size={30}
                        color="green"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowAddReviewModal(true);
                        }}
                      />
                    )}
                    {order.status === "Delivered" && order.review && (
                      <AiFillEye
                        size={30}
                        color="purple"
                        className={styles.reviewEye}
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowReviewModal(true);
                        }}
                      />
                    )}
                    {showAddReviewModal && (
                      <AddOrderReviewModal
                        order={selectedOrder}
                        onClose={closeModal}
                        setIsReviewAdded={setIsReviewAdded}
                      />
                    )}
                    {showReviewModal && (
                      <OrderReviewModal
                        order={selectedOrder}
                        onClose={closeModal}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserOrders;

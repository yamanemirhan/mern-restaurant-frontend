import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./sellerHome.module.css";
import { updateOrder } from "../../../features/order/orderSlice";
import { AiFillEye } from "react-icons/ai";
import OrderReviewModal from "../../../modals/orderReviewModal/OrderReviewModal";
import { useNavigate } from "react-router-dom";

function SellerHome() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const {
    orders,
    loading: { fetchSellerOrders },
  } = useSelector((state) => state.order);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, options);
  };

  const handleUpdateOrder = (id, status) => {
    const data = {
      id,
      status,
    };
    dispatch(updateOrder(data));
  };

  const closeModal = () => {
    setShowReviewModal(false);
  };

  return (
    <div className={styles.container}>
      {fetchSellerOrders ? (
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
                      if (order.item?._id) {
                        navigate(`/seller/products/${order.item?._id}`);
                      }
                    }}
                    className={styles.orderProductName}
                  >
                    {order.item?.name || "Product deleted"}
                  </td>
                  <td>${order.amount}</td>
                  <td>{order.quantity}</td>
                  <td>{order.desc}</td>
                  <td className={styles.orderStatus}>
                    <select
                      defaultValue={order.status}
                      onChange={(e) =>
                        handleUpdateOrder(order._id, e.target.value)
                      }
                      className={styles.orderStatusSelect}
                    >
                      <option value="Idle">Idle</option>
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
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

export default SellerHome;

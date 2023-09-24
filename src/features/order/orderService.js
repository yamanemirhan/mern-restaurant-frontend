import { get, post, put, del } from "../request";
const BASE_URL = "https://mern-restaurant-3hw5.onrender.com/api/order";

const createOrderAPI = (data) =>
  post(`${BASE_URL}/create`, JSON.stringify(data), "application/json");
export const fetchUserOrdersAPI = () => get(`${BASE_URL}/own`);
const deleteOrderAPI = (id) => del(`${BASE_URL}/delete/${id}`);
const fetchSellerOrdersAPI = () => get(`${BASE_URL}/seller`);
const updateOrderAPI = (data) =>
  put(
    `${BASE_URL}/update/${data.id}`,
    JSON.stringify(data),
    "application/json"
  );
export const addCommentAPI = (data) =>
  post(
    `${BASE_URL}/addreview/${data.productId}/${data.orderId}`,
    JSON.stringify(data),
    "application/json"
  );

const orderService = {
  createOrderAPI,
  deleteOrderAPI,
  fetchSellerOrdersAPI,
  updateOrderAPI,
};

export default orderService;

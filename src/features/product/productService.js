import { get } from "../request";
const BASE_URL = "https://mern-restaurant-3hw5.onrender.com/api/product";

export const getProductAPI = (id) => get(`${BASE_URL}/detail/${id}`);
export const getAllProductsAPI = (query) =>
  get(`${BASE_URL}/getAllProducts${query}`);
export const getLikedProducts = () => get(`${BASE_URL}/liked`);
export const getPopularProducts = () => get(`${BASE_URL}/popular`);

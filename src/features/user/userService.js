import { get, put } from "../request";
const BASE_URL = "https://mern-restaurant-3hw5.onrender.com/api/user";

const getUser = () => get(`${BASE_URL}/profile`);
const likeProduct = (id) => put(`${BASE_URL}/like/${id}`);
const editDetails = (data) => put(`${BASE_URL}/edit`, data);
export const getRestaurantAPI = (id) => get(`${BASE_URL}/restaurant/${id}`);
export const getPopularRestaurantsAPI = () =>
  get(`${BASE_URL}/restaurants/popular`);

const userService = {
  getUser,
  likeProduct,
  editDetails,
};

export default userService;

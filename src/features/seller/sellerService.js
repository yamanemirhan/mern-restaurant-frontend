import { get, post, put, del } from "../request";
const BASE_URL = "https://mern-restaurant-3hw5.onrender.com/api/seller";

const getProductsAPI = (query) => get(`${BASE_URL}/getProducts${query}`);
export const getProductssAPI = (query) =>
  get(`${BASE_URL}/getProducts${query}`);

const addProductAPI = (data) => post(`${BASE_URL}/add`, data);
const updateProduct = (data, id) => put(`${BASE_URL}/update/${id}`, data);
const deleteProduct = (id) => del(`${BASE_URL}/delete/${id}`);

const sellerService = {
  getProductsAPI,
  addProductAPI,
  updateProduct,
  deleteProduct,
};

export default sellerService;

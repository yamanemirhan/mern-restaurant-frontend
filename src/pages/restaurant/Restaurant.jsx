import React, { useEffect, useState } from "react";
import styles from "./restaurant.module.css";
import { useParams } from "react-router-dom";
import { getRestaurantAPI } from "../../features/user/userService";
import newToast from "../../services/toast";
import ProductCard from "../../components/productCard/ProductCard";

function Restaurant() {
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getRestaurantAPI(id);
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        setRestaurantInfo(result.data);
        setLoading(false);
      } catch (error) {
        newToast(error.message, "red");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className={styles.restaurantInfo}>
            {restaurantInfo?.profilePicture ? (
              <img
                src={`${import.meta.env.VITE_APP_API_BASE_URL}/images/${
                  restaurantInfo?.profilePicture
                }`}
                alt="user"
                className={styles.userImg}
              />
            ) : (
              <img
                src="https://avatars.mds.yandex.net/i?id=1ebfe7a31aa4c18301077cfafce6f5bdf44ed3a3-9765845-images-thumbs&n=13"
                alt="user"
                className={styles.userImg}
              />
            )}
            <h2>{restaurantInfo?.seller?.company}</h2>
          </div>
          <div className={styles.restaurantProducts}>
            <h3>Products</h3>
            {restaurantInfo?.seller?.products?.length > 0 && (
              <div className={styles.products}>
                {restaurantInfo?.seller?.products?.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Restaurant;

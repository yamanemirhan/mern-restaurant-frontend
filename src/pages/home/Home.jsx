import React, { useEffect, useState } from "react";
import styles from "./home.module.css";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getPopularProducts } from "../../features/product/productService";
import newToast from "../../services/toast";
import { getPopularRestaurantsAPI } from "../../features/user/userService";

function Home() {
  const [popularProducts, setPopularProducts] = useState([]);
  const [popularRestaurants, setPopularRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const menus = [
    {
      id: 9,
      img: "https://free-images.com/lg/89ae/breakfast_breakfast_table_coffee.jpg",
      title: "Breakfast",
    },
    {
      id: 10,
      img: "https://free-images.com/lg/1697/lunch_fast_food_hamburger.jpg",
      title: "Lunch",
    },
    {
      id: 11,
      img: "https://free-images.com/sm/3890/steak_dinner_steak_dinner.jpg",
      title: "Dinner",
    },
    {
      id: 12,
      img: "https://free-images.com/lg/71da/blackboard_chalk_board_cafe.jpg",
      title: "Special",
    },
    {
      id: 13,
      img: "https://free-images.com/sm/3383/snacks_cheese_crackers_520689.jpg",
      title: "Snack",
    },
  ];
  const categories = [
    {
      id: 1,
      img: "https://free-images.com/lg/7590/burgers_grilling_good_mat.jpg",
      title: "Burger",
    },
    {
      id: 2,
      img: "https://free-images.com/sm/bad4/pizza_1.jpg",
      title: "Pizza",
    },
    {
      id: 3,
      img: "https://free-images.com/sm/d249/doner_kebab_kebab_gyros.jpg",
      title: "Doner",
    },
    {
      id: 4,
      img: "https://free-images.com/lg/20bb/lahmacun_azerbaijan.jpg",
      title: "Lahmacun",
    },
    {
      id: 5,
      img: "https://free-images.com/sm/acbf/drink_soda_glass_thirst.jpg",
      title: "Drink",
    },
    {
      id: 6,
      img: "https://free-images.com/sm/d13f/strawberries_strawberry_dessert_1463444.jpg",
      title: "Dessert",
    },
    {
      id: 7,
      img: "https://free-images.com/sm/183f/pie_cooking_kitchen_preparation.jpg",
      title: "Pie",
    },
    {
      id: 8,
      img: "https://free-images.com/sm/23c2/toast_heat_sandwich_food.jpg",
      title: "Toast",
    },
  ];

  let popularSettings = {
    dots: false,
    autoPlay: true,
    showArrows: true,
    arrows: true,
    speed: 300,
    slidesToShow:
      window.innerWidth > 1200
        ? popularRestaurants?.length < 6
          ? popularRestaurants?.length
          : 6
        : window.innerWidth > 900
        ? popularRestaurants?.length < 4
          ? popularRestaurants?.length
          : 4
        : popularRestaurants?.length < 2
        ? popularRestaurants?.length
        : 2,
    slidesToScroll: 1,
    initialSlide: 0,
  };
  let menuSettingss = {
    dots: false,
    autoPlay: true,
    showArrows: true,
    arrows: true,
    speed: 300,
    slidesToShow:
      window.innerWidth > 1280
        ? menus?.length < 5
          ? menus?.length
          : 5
        : window.innerWidth > 768
        ? menus?.length < 4
          ? menus?.length
          : 4
        : menus?.length < 2
        ? menus?.length
        : 2,
    slidesToScroll: 2,
    initialSlide: 0,
  };
  let categorysettings = {
    dots: false,
    autoPlay: true,
    showArrows: true,
    arrows: true,
    speed: 300,
    slidesToShow:
      window.innerWidth > 1280
        ? categories?.length < 7
          ? categories?.length
          : 7
        : window.innerWidth > 940
        ? categories?.length < 5
          ? categories?.length
          : 5
        : window.innerWidth > 770
        ? categories?.length < 4
          ? categories?.length
          : 4
        : window.innerWidth > 640
        ? categories?.length < 3
          ? categories?.length
          : 3
        : categories?.length < 2
        ? categories?.length
        : 2,
    slidesToScroll: 1,
    initialSlide: 0,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPopularProducts();
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        setPopularProducts(result.data);
        setLoading(false);
      } catch (error) {
        newToast(error.message, "red");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPopularRestaurantsAPI();
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        setPopularRestaurants(result.data);
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
      <Carousel
        showThumbs={false}
        autoPlay={true}
        showArrows={false}
        interval={3000}
        infiniteLoop={true}
        showStatus={false}
        className={styles.slider}
      >
        {popularRestaurants?.map((restaurant) => (
          <Link
            to={`/restaurant/${restaurant._id}`}
            className={styles.restaurantInfo}
            key={restaurant._id}
          >
            {restaurant?.img ? (
              <img
                src={`${import.meta.env.VITE_APP_API_BASE_URL}/images/${
                  restaurant?.img
                }`}
                alt="restaurant"
                className={styles.restaurantImage}
              />
            ) : (
              <img
                src="https://avatars.mds.yandex.net/i?id=438af819eb4449ee36013e85faf8758151cbbc2e-9066083-images-thumbs&n=13"
                alt="restaurant"
                className={styles.restaurantImage}
              />
            )}
            <h3 className={styles.restaurantName}>{restaurant?.company}</h3>
          </Link>
        ))}
      </Carousel>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.popularProducts}>
          <h3 className={styles.popularText}>Popular</h3>
          <ReactSlider {...popularSettings} className={styles.cardContainer}>
            {popularProducts?.map((product, index) => (
              <Link
                to={`/products/${product._id}`}
                className={styles.card}
                key={index}
              >
                {product?.img ? (
                  <img
                    src={`${import.meta.env.VITE_APP_API_BASE_URL}/images/${
                      product?.img
                    }`}
                    alt="user"
                    className={styles.productImg}
                  />
                ) : (
                  <img
                    src="https://avatars.mds.yandex.net/i?id=7556519d72bd8fa13fb77f35160e6dff-3480301-images-thumbs&n=13"
                    alt="product"
                    className={styles.productImg}
                  />
                )}
                <div className={styles.productHoverInfo}>
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                  <div className={styles.productStars}>{/* add stars */}</div>
                </div>
              </Link>
            ))}
          </ReactSlider>
        </div>
      )}
      <div className={styles.menus}>
        <h3 className={styles.popularText}>Menus</h3>
        <ReactSlider {...menuSettingss} className={styles.cardContainer}>
          {menus?.map((menu, index) => (
            <Link
              to={`/productsearch?categories=${menu.id}`}
              className={styles.menuCard}
              key={index}
            >
              <img className={styles.menuImg} src={menu.img} alt="menu" />
              <h4 className={styles.menuName}>{menu.title}</h4>
            </Link>
          ))}
        </ReactSlider>
      </div>
      <div className={styles.categories}>
        <h3 className={styles.popularText}>Categories</h3>
        <ReactSlider {...categorysettings} className={styles.cardContainer}>
          {categories?.map((category, index) => (
            <Link
              to={`/productsearch?categories=${category.id}`}
              className={styles.categoryCard}
              key={index}
            >
              <img
                className={styles.categoryImg}
                src={category.img}
                alt="category"
              />
              <h4 className={styles.categoryName}>{category.title}</h4>
            </Link>
          ))}
        </ReactSlider>
      </div>
    </div>
  );
}

export default Home;

import React, { useEffect, useState } from "react";
import styles from "./productSearch.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import newToast from "../../../services/toast";
import ProductCard from "../../../components/seller/productCard/ProductCard";
import { getProductssAPI } from "../../../features/seller/sellerService";
import { useSelector } from "react-redux";

function ProductSearch() {
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(false);
  const [data, setData] = useState(null);
  const [sortType, setSortType] = useState("newest");

  const categories = [
    {
      id: 1,
      name: "Burger",
    },
    {
      id: 2,
      name: "Pizza",
    },
    {
      id: 3,
      name: "Doner",
    },
    {
      id: 4,
      name: "Lahmacun",
    },
    {
      id: 5,
      name: "Drink",
    },
    {
      id: 6,
      name: "Dessert",
    },
    {
      id: 7,
      name: "Pie",
    },
    {
      id: 8,
      name: "Toast",
    },
    {
      id: 9,
      name: "Breakfast",
    },
    {
      id: 10,
      name: "Lunch",
    },
    {
      id: 11,
      name: "Dinner",
    },
    {
      id: 12,
      name: "Special",
    },
  ];

  const { products, isSuccess } = useSelector((state) => state.seller);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const minPriceParam = queryParams.get("minPrice");
    const maxPriceParam = queryParams.get("maxPrice");
    const encodedCategories = queryParams.get("categories");
    const searchParam = queryParams.get("search");
    const pageParam = queryParams.get("page");
    const sortTypeParam = queryParams.get("sortBy");
    let decodedCategories = encodedCategories
      ? encodedCategories.split("%2C")
      : [];
    decodedCategories = decodedCategories
      ? decodedCategories[0]
          ?.split(",")
          .map((category) => parseInt(category, 10))
      : [];
    setMinPrice(minPriceParam || "");
    setMaxPrice(maxPriceParam || "");
    setSelectedCategories(decodedCategories || []);
    setSearch(searchParam || "");
    setPage((pageParam && parseInt(pageParam)) || 1);
    setSortType(sortTypeParam || "newest");
    const categoryNames = decodedCategories?.map((categoryId) => {
      const category = categories.find((item) => item.id === categoryId);
      return category ? category.name : "";
    });
    const fetchData = async () => {
      try {
        const query = `?search=${searchParam || ""}${
          minPriceParam ? "&minPrice=" + minPriceParam : ""
        }${maxPriceParam ? "&maxPrice=" + maxPriceParam : ""}${
          pageParam ? "&page=" + pageParam : ""
        }${sortTypeParam ? "&sortBy=" + sortTypeParam : ""}${
          categoryNames ? "&categories=" + JSON.stringify(categoryNames) : ""
        }`;

        setIsLoading(true);
        const response = await getProductssAPI(query);
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        setData(result);
        setPage(1);
        setIsLoading(false);
      } catch (error) {
        newToast(error.message, "red");
        setIsLoading(false);
      }
    };
    fetchData();
  }, [products, isSuccess]);

  const handleCategoryToggle = () => {
    setCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const handleCategoryChange = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const nextPage = async () => {
    setPage((prevPage) => prevPage + 1);
    handleApplyFilters(page + 1);
  };

  const previousPage = () => {
    setPage(page - 1);
    handleApplyFilters(page - 1);
  };

  const handleSortChange = (event) => {
    setSortType(event.target.value);
    handleApplyFilters(page, event.target.value);
  };

  const handleMinPriceChange = (event) => {
    let newMinPrice = parseInt(event.target.value);
    if (newMinPrice < 0) {
      newMinPrice = 0;
    }

    if (newMinPrice >= maxPrice) {
      setMaxPrice(null);
    }

    setMinPrice(newMinPrice);
  };

  const handleMaxPriceChange = (event) => {
    let newMaxPrice = parseInt(event.target.value);
    if (newMaxPrice < 0) {
      newMaxPrice = 0;
    }

    setMaxPrice(newMaxPrice);
  };

  const handleApplyFilters = (currentPage, currentSortType) => {
    const queryParams = new URLSearchParams();
    minPrice && queryParams.append("minPrice", minPrice);
    maxPrice && queryParams.append("maxPrice", maxPrice);
    search && queryParams.append("search", search);
    currentPage && queryParams.append("page", currentPage);
    currentSortType && queryParams.append("sortBy", currentSortType);

    const encodedCategories = selectedCategories?.map((category) =>
      encodeURIComponent(category)
    );
    selectedCategories?.length > 0 &&
      queryParams.append("categories", encodedCategories.join(","));

    const newUrl = `/seller/productsearch?${queryParams.toString()}`;
    navigate(newUrl);

    const fetchData = async () => {
      try {
        const categoryNames = selectedCategories?.map((categoryId) => {
          const category = categories.find((item) => item.id === categoryId);
          return category ? category.name : "";
        });

        const query = `?search=${search || ""}${
          minPrice ? "&minPrice=" + minPrice : ""
        }${maxPrice ? "&maxPrice=" + maxPrice : ""}${
          currentSortType ? "&sortBy=" + currentSortType : ""
        }${currentPage ? "&page=" + currentPage : ""}${
          categoryNames.length > 0
            ? "&categories=" + JSON.stringify(categoryNames)
            : ""
        }`;

        setIsLoading(true);
        const response = await getProductssAPI(query);
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        setData(result);
        setPage(currentPage);
        setIsLoading(false);
      } catch (error) {
        newToast(error.message, "red");
        setIsLoading(false);
      }
    };
    fetchData();
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.productSearchInput}
        />
        <div className={styles.categoryDropdown}>
          <button
            className={styles.categoryToggle}
            onClick={handleCategoryToggle}
          >
            Kategori
          </button>
          {isCategoryDropdownOpen && (
            <div className={styles.categoryList}>
              {categories.map((category) => (
                <label
                  key={category.id}
                  htmlFor={`category-${category.id}`}
                  className={styles.category}
                >
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <span>{category?.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className={styles.productSearchPrice}>
          <div>
            <label htmlFor="min-price">Min Price</label>
            <input
              type="number"
              id="min-price"
              value={minPrice || ""}
              onChange={handleMinPriceChange}
              min="0"
            />
          </div>
          <div>
            <label htmlFor="max-price">Max Price</label>
            <input
              type="number"
              id="max-price"
              value={maxPrice || ""}
              onChange={handleMaxPriceChange}
              min={minPrice ? minPrice + 1 : 1}
            />
          </div>
        </div>
        <select
          className={styles.productSearchSort}
          id="sort-select"
          value={sortType}
          onChange={handleSortChange}
        >
          <option value="newest">Newest</option>
          <option value="lowest-price">Lowest Price</option>
          <option value="highest-price">Highest Price</option>
          <option value="most-favorited">Highest Star</option>
        </select>
        <button
          onClick={() => handleApplyFilters(page, sortType)}
          className={styles.productSearhApplyBtn}
        >
          Apply
        </button>
      </div>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : data?.data?.products?.length > 0 ? (
          <>
            <div className={styles.searchedProducts}>
              {data?.data?.products?.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
            </div>
            {data?.data && Object.keys(data?.data?.pagination)?.length > 0 && (
              <div className={styles.paginationBtns}>
                <button
                  onClick={previousPage}
                  disabled={!data?.data?.pagination?.previous && true}
                >
                  {"<"}
                </button>
                {page}
                <button
                  onClick={nextPage}
                  disabled={!data?.data?.pagination?.next && true}
                >
                  {">"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.productNotFound}>Product Not Found!</div>
        )}
      </div>
    </div>
  );
}

export default ProductSearch;

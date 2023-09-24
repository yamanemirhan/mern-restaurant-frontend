import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
import { logout } from "../../features/auth/authSlice";

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const userDropdown = [
    {
      id: 1,
      title: "Profile",
      to: "/profile",
    },
    {
      id: 2,
      title: "Orders",
      to: "/orders",
    },
    {
      id: 3,
      title: "Liked",
      to: "/liked",
    },
    {
      id: 4,
      title: "Settings",
      to: "/settings",
    },
  ];
  const sellerDropdown = [
    {
      id: 1,
      title: "Products",
      to: "productsearch",
    },
    {
      id: 2,
      title: "Add Product",
      to: "add",
    },
    {
      id: 3,
      title: "Settings",
      to: "settings",
    },
  ];

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      window.location.href = `${
        user?.role === "seller"
          ? `/seller/productsearch?search=${searchText}`
          : `/productsearch?search=${searchText}`
      } `;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.logo}>
        <Link to={`${user?.role === "seller" ? "/seller" : "/"}`}>
          RESTAURANTS
        </Link>
      </h1>
      <div onKeyDown={handleKeyPress}>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      {user ? (
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className={styles.userInfo}
        >
          {user?.profilePicture ? (
            <img
              src={`${import.meta.env.VITE_APP_API_BASE_URL}/images/${
                user?.profilePicture
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
          <span className={styles.userName}>
            {user?.firstName + " " + user?.lastName}
          </span>
          {showDropdown ? (
            user?.role === "user" ? (
              <ul className={styles.dropdown}>
                {userDropdown.map((ud) => (
                  <li key={ud.id}>
                    <Link to={`${ud.to}`}> {ud.title}</Link>
                  </li>
                ))}
                <li>
                  <Link to={"/"} onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </ul>
            ) : user?.role === "seller" ? (
              <ul className={styles.dropdown}>
                {sellerDropdown.map((sd) => (
                  <li key={sd.id}>
                    <Link to={`${sd.to}`}>{sd.title}</Link>
                  </li>
                ))}
                <li>
                  <Link to={"/"} onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </ul>
            ) : null
          ) : null}
        </div>
      ) : (
        <div className={styles.authLinks}>
          <Link to={"/login"}>Login</Link>
          <span>|</span>
          <Link to={"/register"}>Register</Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { login } from "../../features/auth/authSlice";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoggedIn,
    loading: { login: isLoadingLogin },
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [dispatch, isLoggedIn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    dispatch(login(formData))
      .then((response) => {
        if (response.payload.success) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.login}>
        <div className={styles.loginHeader}>
          <h1 className="">Login</h1>
          <span className={styles.pingAnim} />
        </div>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.formElement}>
            <label className={styles.formLabel} htmlFor="email">
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className={styles.formElement}>
            <label className={styles.formLabel} htmlFor="password">
              Password
            </label>
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
            />
          </div>
          <button
            disabled={isLoadingLogin}
            type="submit"
            className={`${styles.loginBtn} 
            isLoadingLogin &&
              ${styles.loginBtnLoading}
            }`}
          >
            {isLoadingLogin ? "Loging in..." : "Login"}
          </button>
          <div>
            <p>Demo Accounts:</p>
            <div>test@gmail.com | 123456</div>
            <div>seller1@gmail.com | 123123</div>
          </div>
          <span className={styles.qText}>
            Don't you have an account?&nbsp;&nbsp;
            <Link to="/register" className={styles.loginLink}>
              Register
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Login;

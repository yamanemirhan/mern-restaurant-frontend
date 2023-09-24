import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import { register } from "../../features/auth/authSlice";
import newToast from "../../services/toast";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoggedIn,
    loading: { register: isLoadingRegister },
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

  const handleRegister = (e) => {
    e.preventDefault();

    const { confirmPassword, ...userData } = formData;

    if (confirmPassword !== formData.password) {
      newToast("Passwords do not match", "red");
      return;
    }

    dispatch(register(userData))
      .then((response) => {
        if (response.payload.success) {
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <div className={styles.registerWrapper}>
      <div className={styles.register}>
        <div className={styles.registerHeader}>
          <h1 className="">Register</h1>
          <span className={styles.pingAnim} />
        </div>
        <form className={styles.registerForm} onSubmit={handleRegister}>
          <div className={styles.formElement}>
            <label className={styles.formLabel} htmlFor="firstName">
              First Name
            </label>
            <input
              required
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className={styles.formElement}>
            <label className={styles.formLabel} htmlFor="lastName">
              Last Name
            </label>
            <input
              required
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input"
            />
          </div>
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
          <div className={styles.formElement}>
            <label className={styles.formLabel} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              required
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
            />
          </div>
          <button
            disabled={isLoadingRegister}
            type="submit"
            className={`${styles.registerBtn} 
            isLoadingRegister &&
              ${styles.registerBtnLoading}
            }`}
          >
            {isLoadingRegister ? "Registering..." : "Register"}
          </button>
          <span className={styles.qText}>
            Do you have an account?&nbsp;&nbsp;
            <Link to="/login" className={styles.loginLink}>
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Register;

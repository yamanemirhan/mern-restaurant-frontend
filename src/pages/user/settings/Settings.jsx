import React, { useEffect, useState } from "react";
import styles from "./settings.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { editDetails } from "../../../features/user/userSlice";

function UserSettings() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    profile_image: null,
  });

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user, isSuccess } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        company: user?.seller.company || "",
      });
    }
  }, [user, isSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profile_image: file,
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("profile_image", formData.profile_image);

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      company: formData.company,
    };
    data.append("userData", JSON.stringify(userData));

    dispatch(editDetails(data));
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <div className={styles.container}>
      <h1>Settings</h1>
      <div className={styles.settingsInfo}>
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
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <div className={styles.settingsFullName}>
          <input
            value={formData.firstName}
            type="text"
            required
            name="firstName"
            onChange={handleChange}
          />
          <input
            type="text"
            value={formData.lastName}
            required
            name="lastName"
            onChange={handleChange}
          />
        </div>
        {user?.role === "seller" && (
          <input
            type="text"
            value={formData.company}
            required
            name="company"
            onChange={handleChange}
          />
        )}
        <div className={styles.buttonWrapper}>
          <button onClick={handleEdit} className={styles.saveSettingsBtn}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserSettings;

import React from "react";
import { useSelector } from "react-redux";
import styles from "./home.module.css";

function UserHome() {
  const { user } = useSelector((state) => state.user);

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <div>
          {user?.profilePicture ? (
            <img
              src={`${import.meta.env.VITE_APP_API_BASE_URL}/images/${
                user?.profilePicture
              }`}
              alt="user"
              className={styles.userImage}
            />
          ) : (
            <img
              src="https://avatars.mds.yandex.net/i?id=1ebfe7a31aa4c18301077cfafce6f5bdf44ed3a3-9765845-images-thumbs&n=13"
              alt="user"
              className={styles.userImage}
            />
          )}
        </div>
        <h2>{user?.firstName + " " + user?.lastName}</h2>
      </div>
    </div>
  );
}

export default UserHome;

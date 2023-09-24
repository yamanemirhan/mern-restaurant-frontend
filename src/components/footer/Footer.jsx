import React from "react";
import styles from "./footer.module.css";

function Footer() {
  return (
    <div className={styles.container}>
      <ul className={styles.footerList}>
        <li>
          To learn more about how user data is processed and how we protect your
          privacy, please review our <span>Privacy Policy</span>.
        </li>
        <li>
          Read our <span>Terms of Service</span>, which are applicable when
          using our platform.
        </li>
        <li>
          Visit our <span>About Us</span> page for more information.
        </li>
      </ul>
    </div>
  );
}

export default Footer;

import React from "react";
import styles from "./landing.module.scss";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Logo />
        <Link className={styles.callToActionBtn} to="/creator">
          Create new page
        </Link>
      </div>
      <div className={styles.body}>
        <div>
          <p className={styles.title}>
            Start your own fun page and earn TONs by selling your photos
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;

export const Logo = () => {
  return (
    <Link className={styles.name} to="/">
      <p className={styles.name}>
        Only<span className={styles.tonLabel}>TON</span>s
      </p>
    </Link>
  );
};

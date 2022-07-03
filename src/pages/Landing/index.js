import React, { useRef } from "react";
import styles from "./landing.module.scss";
import { Link } from "react-router-dom";
import { makeid } from "../../components/connection/useConnection";

const Landing = () => {
  const channelId = useRef(makeid(20));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Logo />
        <Link
          className={styles.callToActionBtn}
          to={`/artist/${channelId.current}`}
        >
          Start new page
        </Link>
      </div>
      <div className={styles.body}>
        <div>
          <p className={styles.title}>
            Start your own fun page and earn TONs by selling your photos.
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

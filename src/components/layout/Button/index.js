import React from 'react';
import styles from './btn.module.scss';

const Button = ({children}) => {
  return (
    <button className={styles.btn}>
      {children}
    </button>
  );
};

export default Button;
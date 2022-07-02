import React from 'react';
import styles from './btn.module.scss';
import cx from 'classnames';

const Button = ({className, children}) => {
  return (
    <button className={cx(styles.btn, className)}>
      {children}
    </button>
  );
};

export default Button;
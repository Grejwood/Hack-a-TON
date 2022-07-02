import React from 'react';
import styles from './btn.module.scss';
import cx from 'classnames';

const Button = ({className, children, disabled = false}) => {
  return (
    <button
      className={cx(styles.btn, className, {[styles.disabled]: disabled })}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
import React from 'react';
import styles from './btn.module.scss';
import cx from 'classnames';

const Button = ({
  className,
  children,
  disabled = false,
  isLoading = false,
  ...rest
}) => {
  return (
    <button
      className={cx(styles.btn, className, {
        [styles.disabled]: disabled || isLoading
      })}
      disabled={disabled}
      {...rest}
    >
      {isLoading ? 'processing' : children}
    </button>
  );
};

export default Button;
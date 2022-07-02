import React from "react";
import style from "./input.module.scss";
import cx from "classnames";

const Input = ({ className, onChange }) => {
  const onChangeProxy = (e) => {
    if(onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <input
      className={cx(className, style.input)}
      onChange={onChangeProxy}
      type="number"
      required
    />
  );
};

export default Input;
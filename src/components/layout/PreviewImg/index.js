import React, {useState} from "react";
import style from "./previewImg.module.scss";
import cx from "classnames";
import Input from "../Input";

const PreviewImg = ({className, files}) => {
  const [price, setPrice]= useState();

  return (
    <div className={cx(className, style.cards)}>
      {files.map(file => (
        <div className={cx(style.thumb, style.card)} key={file.name}>
          <div className={style.thumbInner}>
            <img
              className={style.img}
              src={file.preview}
              onLoad={() => {
                URL.revokeObjectURL(file.preview)
              }}
              alt="image"
            />

            <Input
              className={style.input}
              value={price}
              onChange={setPrice}
            />

          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewImg;
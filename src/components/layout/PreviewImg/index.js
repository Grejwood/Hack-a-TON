import React from "react";
import style from "./previewImg.module.scss";
import cx from "classnames";

const PreviewImg = ({className, files, blur}) => {
  return (
    <div className={cx(className, style.cards)}>
      {files.map(file => (
        <div className={cx(style.thumb, style.card)} key={file.name}>
          <div className={style.thumbInner}>
            <img
              className={cx(style.img, {[style.blur]: blur})}
              src={file.preview}
              onLoad={() => {
                URL.revokeObjectURL(file.preview)
              }}
              alt="image"
            />

          <div className={style.footerCard}>
            <p className={style.label}>IMG</p>
            <span className={style.price}>2.4 TON</span>
          </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewImg;
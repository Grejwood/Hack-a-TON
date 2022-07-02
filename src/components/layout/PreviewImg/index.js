import React from "react";
import style from "./previewImg.module.scss";
import cx from "classnames";
import Button from '../Button';

const PreviewImg = ({className, files, blur, guest}) => {
  return (
    <div className={cx(className, style.cards)}>
      {files.map((file) => (
        <div className={cx(style.thumb, style.card)} key={file.name || file.preview}>
          <div className={style.thumbInner}>
            {!guest ? (
              <img
                className={cx(style.img, {[style.blur]: blur})}
                src={file.preview}
                onLoad={() => {URL.revokeObjectURL(file.preview)}}
                alt="image"
              />
            ) : (
              <img
                className={cx(style.img, {
                  [style.blur]: !file.isSell
                })}
                src={file.preview}
                alt="image"
              />
            )}

            <div className={style.footerCard}>
              <div>
                <p className={style.label}>IMG</p>
                <span className={style.price}>2.4 TON</span>
              </div>
              {guest && !file.isSell && (
                <Button className={style.buyBtn}>
                  Buy Now
                </Button>
              )}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewImg;
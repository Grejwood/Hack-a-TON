import React from "react";
import style from "./previewImg.module.scss";
import cx from "classnames";
import Button from "../Button";
import {fromNano, toNano} from "../../../utils";

const PreviewImg = ({ className, blur, slots, guest, buySlot, canBuy }) => {
  return (
    <div className={cx(className, style.cards)}>
      {slots.map((file, key) => (
        <div className={cx(style.thumb, style.card)} key={key}>
          <div className={style.thumbInner}>
            {!guest ? (
              <img
                className={cx(style.img, { [style.blur]: blur })}
                src={file.content}
                alt="image"
              />
            ) : (
              <img
                className={cx(style.img, {
                  [style.blur]: !file.isSold,
                })}
                src={file.content}
                alt="image"
              />
            )}
            <div className={style.footerCard}>
              <div>
                <p className={style.label}>Photo {key + 1}</p>
                <span className={style.price}>
                  Price {fromNano(file.price)} TON
                </span>
              </div>
              {guest && !file.isSold && canBuy && (
                <Button className={style.buyBtn} onClick={() => buySlot(file)}>
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

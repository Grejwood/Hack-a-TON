import React, { useState } from "react";
import style from "../Artist/home.module.scss";

import Button from "../../components/layout/Button";
import PreviewImg from "../../components/layout/PreviewImg";
import { Logo } from "../Landing";

import { toNano } from "../../utils";

import photo11 from "../../assets/img/photo11.jpeg";
import photo2 from "../../assets/img/photo2.jpeg";
import photo3 from "../../assets/img/photo3.jpeg";
import photo4 from "../../assets/img/photo4.jpeg";
import photo8 from "../../assets/img/photo8.jpeg";
import photo10 from "../../assets/img/photo10.jpeg";

const ArtistView = ({ status, slots, setSlots }) => {
  const [files, setFiles] = useState([]);
  const [blur, setBlur] = useState(false);
  const [guest, setGuest] = useState(false);
  const [isPublish, setIsPublish] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("0x543fmv59ghj458bh5b934");

  const onSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSlots([
        {
          id: 1,
          content: photo11,
          price: toNano("0.1").toString(),
          isSold: false,
        },
        {
          id: 2,
          content: photo2,
          price: toNano("0.1").toString(),
          isSold: false,
        },
        {
          id: 3,
          content: photo3,
          price: toNano("0.1").toString(),
          isSold: false,
        },
        {
          id: 4,
          content: photo4,
          price: toNano("0.1").toString(),
          isSold: false,
        },
        {
          id: 5,
          content: photo8,
          price: toNano("0.1").toString(),
          isSold: false,
        },
        {
          id: 6,
          content: photo10,
          price: toNano("0.1").toString(),
          isSold: false,
        },
      ]);
      setIsPublish(true);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <Logo />
        <Button
          className={style.submitBtn}
          onClick={onSubmit}
          isLoading={isLoading}
          disabled={isPublish}
        >
          {isPublish ? 'Published' : 'Publish Content'}
        </Button>
      </div>

      <div className={style.info}>
        <span className={style.name}>For Creator</span>
        <p className={style.label}>
          Balance: <span>{balance}</span>
        </p>
        <p className={style.label}>
          Address: <span>{address}</span>
        </p>
      </div>

      {isPublish && <span className={style.published}>Published</span>}

      <div className={style.dropzone} onClick={onSubmit}>
        <p className={style.dropzoneText}>Drop the files here...</p>
      </div>

      {slots && isPublish && (
        <PreviewImg
          className={style.thumbsContainer}
          slots={slots}
          blur={blur}
          isPublish={isPublish}
        />
      )}
    </div>
  );
};

export default ArtistView;

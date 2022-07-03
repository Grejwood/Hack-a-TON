import React, {useState, useEffect} from 'react';
import axios from "axios";
import style from "../Home/home.module.scss";
import PreviewImg from "../../components/layout/PreviewImg";
import Button from "../../components/layout/Button";

import imageOne from "../../assets/img/imageOne.jpg";
import ImageTwo from "../../assets/img/ImageTwo.jpg";
import imageThree from "../../assets/img/imageThree.jpg";
import imageFour from "../../assets/img/imageFour.jpg";
import imageFive from "../../assets/img/imageFive.jpg";
import {Logo} from "../Landing";

const Guest = () => {
  const [guest, setGuest] = useState(true);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("0x543fmv59ghj458bh5b934");

  const listOfImages = [
    {preview: imageOne, isSell: false},
    {preview: ImageTwo, isSell: true},
    {preview: imageThree, isSell: false},
    {preview: imageFour, isSell: false},
    {preview: imageFive, isSell: false}
  ];

  // useEffect(() => {
  //   axios
  //     .get("CommunicationEndpoint http://jsonplaceholder.typicode.com/posts")
  //     .then((response) => setFiles(response.data));
  // }, []);

  return (
    <div className={style.container}>

      <div className={style.header}>
        <Logo/>
        <Button>
          TON Wallet Connect
        </Button>
      </div>

      <div className={style.info}>
        <span className={style.name}>For Guest</span>
        <p className={style.label}>Balance: <span>{balance}</span></p>
        <p className={style.label}>Address: <span>{address}</span></p>
      </div>

      <PreviewImg
        className={style.thumbsContainer}
        files={listOfImages}
        guest={guest}
      />
    </div>
  );
};

export default Guest;
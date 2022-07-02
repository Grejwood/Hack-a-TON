import React, {useState} from 'react';
import style from "../Home/home.module.scss";
import PreviewImg from "../../components/layout/PreviewImg";
import Button from "../../components/layout/Button";

import imageOne from "../../assets/img/imageOne.jpg";
import ImageTwo from "../../assets/img/ImageTwo.jpg";
import imageThree from "../../assets/img/imageThree.jpg";
import imageFour from "../../assets/img/imageFour.jpg";
import imageFive from "../../assets/img/imageFive.jpg";

const Guest = () => {
  const [guest, setGuest] = useState(true);

  const listOfImages = [
    {preview: imageOne, isSell: false},
    {preview: ImageTwo, isSell: true},
    {preview: imageThree, isSell: false},
    {preview: imageFour, isSell: false},
    {preview: imageFive, isSell: false}
  ];

  return (
    <div className={style.container}>

      <div className={style.header}>
        <span className={style.name}>ProjectName</span>
        <Button>
          TON Wallet Connect
        </Button>
      </div>

      <div>
        <p>List of images</p>
        <p>Balance: </p>
        <p>Address: </p>
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
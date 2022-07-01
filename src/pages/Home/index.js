import React from 'react';
import {useDropzone} from "react-dropzone"

import style from "./home.module.scss";
import Button from "../../components/layout/Button";
import Dropzone from "../../components/layout/Dropzone";

const Home = (props) => {
  return (
    <div className={style.container}>

      <div className={style.header}>
        <span className={style.name}>ProjectName</span>
        <Button>
          TON Wallet connect
        </Button>
      </div>

      <Dropzone/>

      <div className={style.cards}>
        <div className={style.card}>ONE</div>
        <div className={style.card}>TWO</div>
        <div className={style.card}>THREE</div>
        <div className={style.card}>FOUR</div>
        <div className={style.card}>FIVE</div>
        <div className={style.card}>SIX</div>
        <div className={style.card}>SEVEN</div>
        <div className={style.card}>EIGHT</div>
        <div className={style.card}>NINE</div>
        <div className={style.card}>TEN</div>
        <div className={style.card}>ELEVEN</div>
        <div className={style.card}>TWELVE</div>
      </div>

    </div>
  );
};

export default Home;
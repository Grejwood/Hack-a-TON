import React from 'react';
import style from "./home.module.scss";
import Button from "../../components/layout/Button";
import Dropzone from "../../components/layout/Dropzone";

const Home = (props) => {
  return (
    <div className={style.container}>
      <div className={style.header}>
        <span className={style.name}>ProjectName</span>
        <Button>
          TON Wallet Connect
        </Button>
      </div>

      <Dropzone />

      <Button className={style.submitBtn}>Submit photo</Button>

    </div>
  );
};

export default Home;
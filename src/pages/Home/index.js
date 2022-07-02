import React, {useState} from "react";
import style from "./home.module.scss";
import Button from "../../components/layout/Button";
import Dropzone from "../../components/layout/Dropzone";
import PreviewImg from "../../components/layout/PreviewImg";
import {Logo} from "../Landing";

const Home = () => {
  const [files, setFiles] = useState([]);
  const [blur, setBlur]= useState(false);
  const [guest, setGuest] = useState(false);
  const [isPublish, setIsPublish] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("0x543fmv59ghj458bh5b934");

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsPublish(true)
      setIsLoading(false);
    }, 5000);
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <Logo/>
        <Button>
          TON Wallet Connect
        </Button>
      </div>

      <div className={style.info}>
        <span className={style.name}>For Creator</span>
        <p className={style.label}>Balance: <span>{balance}</span></p>
        <p className={style.label}>Address: <span>{address}</span></p>
      </div>

      {!isPublish && (
        <Button
          className={style.submitBtn}
          onClick={onSubmit}
          isLoading={isLoading}
          disabled={!files.length}
        >
          Publish Content
        </Button>
      )}

      {isPublish &&
        <span className={style.published}>Published</span>
      }

      {!guest && (
        <Dropzone
          files={files}
          setFiles={setFiles}
        />
      )}

      {!!files.length && (
        <PreviewImg
          className={style.thumbsContainer}
          files={files}
          blur={blur}
        />
      )}
    </div>
  );
};

export default Home;
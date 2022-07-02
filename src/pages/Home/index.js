import React, {useState} from "react";
import style from "./home.module.scss";
import Button from "../../components/layout/Button";
import Dropzone from "../../components/layout/Dropzone";
import PreviewImg from "../../components/layout/PreviewImg";

const Home = (props) => {
  const [files, setFiles] = useState([]);
  const [blur, setBlur]= useState(false);
  const [guest, setGuest] = useState(false);

  return (
    <div className={style.container}>
      <div className={style.header}>
        <span className={style.name}>ProjectName</span>
        <Button>
          TON Wallet Connect
        </Button>
      </div>

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

      <Button
        className={style.submitBtn}
        disabled={!files.length}
      >
        Send Photos
      </Button>
    </div>
  );
};

export default Home;
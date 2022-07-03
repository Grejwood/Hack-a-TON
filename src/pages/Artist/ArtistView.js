import React, { useState } from "react";
import style from "../Artist/home.module.scss";

import Button from "../../components/layout/Button";
import PreviewImg from "../../components/layout/PreviewImg";
import { Logo } from "../Landing";

import { fromNano, toNano } from "../../utils";

import photo11 from "../../assets/img/photo11.jpeg";
import photo2 from "../../assets/img/photo2.jpeg";
import photo3 from "../../assets/img/photo3.jpeg";
import photo4 from "../../assets/img/photo4.jpeg";
import photo8 from "../../assets/img/photo8.jpeg";
import photo10 from "../../assets/img/photo10.jpeg";
import loaderContent from "../../assets/img/loaderContent.svg";

const ArtistView = ({
  status,
  slots,
  setSlots,
  publishPage,
  channelId,
  fullState,
  walletAddressB,
  channelAddress,
}) => {
  const [isLoading, setIsLoading] = useState(false);

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
          price: toNano("0.3").toString(),
          isSold: false,
        },
        {
          id: 4,
          content: photo4,
          price: toNano("0.4").toString(),
          isSold: false,
        },
        {
          id: 5,
          content: photo8,
          price: toNano("0.5").toString(),
          isSold: false,
        },
        {
          id: 6,
          content: photo10,
          price: toNano("0.6").toString(),
          isSold: false,
        },
      ]);
      setIsLoading(false);
    }, 2000);
  };

  const statusLabel = {
    empty: "",
    notPublished: "",
    notStarted: "Awaiting the fan to join the page...",
    channelInit: "Establishing payment channel with the fan...",
    channelOpen: "Channel is open.",
    channelClosing: "Channel is being closed...",
    channelClosed: "Channel closed",
  }[status];

  let currentInstruction;

  if (status === "empty") {
    currentInstruction = <>Please upload photos that you want to sell.</>;
  } else if (status === "notStarted") {
    const joinLink = `https://main.d3puvu1kvbh8ti.amplifyapp.com/guest/${channelId}`;
    currentInstruction = (
      <>
        Share the link with the fan for them to join the page.{" "}
        <a href={joinLink} target="_blank">
          {joinLink}
        </a>
      </>
    );
  } else if (status === "channelOpen") {
    currentInstruction = (
      <>
        The fan can now select photos. Your balance will update automatically as
        soon as the fan buys some photo.
      </>
    );
  } else if (status === "channelClosed") {
    currentInstruction = (
      <>
        Payment session was successfully ended. Money that you earned were
        transferred to your wallet.
      </>
    );
  }

  return (
    <div className={style.container}>
      <div className={style.header}>
        <Logo />
        {["empty", "notPublished", "notStarted"].includes(status) && (
          <Button
            className={style.submitBtn}
            onClick={publishPage}
            disabled={status !== "notPublished"}
          >
            Publish page
          </Button>
        )}
      </div>

      <div className={style.info}>
        <span className={style.name}>For Creator</span>
        {statusLabel && (
          <p className={style.label}>
            Channel Status: <span>{statusLabel}</span>
          </p>
        )}
        {walletAddressB && (
          <p className={style.label}>
            Your temporary wallet: <span>{walletAddressB}</span>
          </p>
        )}
        {channelAddress && (
          <p className={style.label}>
            Smart-contract address: <span>{channelAddress}</span>
          </p>
        )}
        {fullState.current && (
          <p className={style.label}>
            Your balance:
            <span>{fromNano(fullState.current.balanceB)} TON</span>
          </p>
        )}
        {currentInstruction && (
          <p className={style.label} style={{ paddingTop: 25, fontSize: 18 }}>
            <p style={{ fontWeight: "bold", fontSize: 16 }}>
              Current instructions:
            </p>
            {currentInstruction}
          </p>
        )}
      </div>

      {status === "empty" && (
        <div className={style.dropzone} onClick={onSubmit}>
          <p className={style.dropzoneText}>
            {isLoading ? (
              <img className={style.loader} src={loaderContent} alt="loader" />
            ) : (
              "Drop the files here, or click to select them"
            )}
          </p>
        </div>
      )}

      {slots && <PreviewImg className={style.thumbsContainer} slots={slots} />}
    </div>
  );
};

export default ArtistView;

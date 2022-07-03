import React from "react";
import style from "../Artist/home.module.scss";
import PreviewImg from "../../components/layout/PreviewImg";
import Button from "../../components/layout/Button";

import { Logo } from "../Landing";
import { fromNano } from "../../utils";

const GuestView = ({
  status,
  walletAddressA,
  startChannel,
  closeChannel,
  channelAddress,
  fullState,
  slots,
  buySlot,
}) => {
  const statusLabel = {
    notStarted: "Channel not started",
    checkingBalance: "Checking your balance...",
    startingChannel: "Channel is starting...",
    deployingChannel: "Smart-contract is being deployed...",
    toppingUpChannel:
      "Smart-contract deployed. Sending funds to the channel...",
    initingChannel:
      "Channel has been replenished. Syncing state with the artist...",
    channelOpen: "Channel is open.",
    channelClosing: "Channel is being closed...",
    channelClosed: "Channel closed",
  }[status];

  let currentInstruction;

  if (status === "notStarted") {
    currentInstruction = (
      <>
        To start a payment channel, top-up your temporary address{" "}
        <b>{walletAddressA}</b>. Send amount you're expecting to spend +0.02 TON
        for network fees. After closing the channel unspent funds will return to
        your main wallet.
      </>
    );
  } else if (status === "channelOpen") {
    currentInstruction = (
      <>
        Your payment channel with an artist is open and you can start buying
        photos.
      </>
    );
  } else if (status === "channelClosed") {
    currentInstruction = (
      <>
        Payment session was successfully ended. Your remaining balance will be
        returned to your account.
      </>
    );
  }

  return (
    <div className={style.container}>
      <div className={style.header}>
        <Logo />
        {[
          "notStarted",
          "checkingBalance",
          "startingChannel",
          "deployingChannel",
          "toppingUpChannel",
          "initingChannel",
        ].includes(status) && (
          <Button onClick={startChannel} disabled={status !== "notStarted"}>
            Start payment channel
          </Button>
        )}
        {["channelOpen", "channelClosing"].includes(status) && (
          <Button onClick={closeChannel} disabled={status !== "channelOpen"}>
            Close the channel
          </Button>
        )}
      </div>

      <div className={style.info}>
        <span className={style.name}>For Guest</span>
        <p className={style.label}>
          Channel Status: <span>{statusLabel}</span>
        </p>
        {walletAddressA && (
          <p className={style.label}>
            Your temporary wallet: <span>{walletAddressA}</span>
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
            <span>{fromNano(fullState.current.balanceA)} TON</span>
          </p>
        )}
        {currentInstruction && (
          <p className={style.label}>
            Current instructions: <br />
            {currentInstruction}
          </p>
        )}
      </div>

      <PreviewImg
        className={style.thumbsContainer}
        slots={slots}
        guest={true}
        buySlot={buySlot}
        canBuy={status === "channelOpen"}
      />
    </div>
  );
};

export default GuestView;

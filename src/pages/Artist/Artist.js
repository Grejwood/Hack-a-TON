import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useConnection } from "../../components/connection/useConnection";
import { fromNano, getProvider, getWallet, toNano } from "../../utils";
import BN from "bn.js";
import ArtistView from "./ArtistView";

export const Artist = () => {
  const providerRef = useRef(null);
  const tonweb = providerRef.current;
  const [walletAddressB, setWalletAddress] = useState(null);
  const [walletB, setWallet] = useState(null);
  const [keyPairB, setKeyPair] = useState(null);
  const [status, setStatus] = useState("notStarted");
  const channel = useRef(null);
  const fullState = useRef(null);
  const lastSignature = useRef(null);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    setUp();
  }, []);

  const setUp = async () => {
    providerRef.current = getProvider();
    const [newKeyPair, wallet] = getWallet(
      providerRef.current,
      "L3mPBNy0eCtZbCen+fEQlwBuN2WhtWxDlZF5isKhqlY="
    );
    setWallet(wallet);
    setKeyPair(newKeyPair);
    const walletAddress = await wallet.getAddress();
    setWalletAddress(walletAddress.toString(true, true, true));
  };

  const requestSlots = () => {
    sendEvent("availableSlots", {
      slots,
      paymentChannel: 1,
      walletAddressB,
      publicKeyB: keyPairB.publicKey,
    });
  };

  const shareChannelConfig = async ({ channelConfig }) => {
    setStatus("channelInit");

    const channelInitState = {
      balanceA: toNano(channelConfig.initBalanceA), // A's initial balance in Toncoins. Next A will need to make a top-up for this amount
      balanceB: toNano("0"), // B's initial balance in Toncoins. Next B will need to make a top-up for this amount
      seqnoA: new BN(0), // initially 0
      seqnoB: new BN(0), // initially 0
    };

    const config = {
      channelId: new BN(channelConfig.channelId), // Channel ID, for each new channel there must be a new ID
      addressA: new tonweb.Address(channelConfig.walletAddressA), // A's funds will be withdrawn to this wallet address after the channel is closed
      addressB: new tonweb.Address(walletAddressB), // B's funds will be withdrawn to this wallet address after the channel is closed
      initBalanceA: channelInitState.balanceA,
      initBalanceB: channelInitState.balanceB,
    };

    const hisPublicKey = new Uint8Array(
      Object.values(channelConfig.publicKeyA)
    );

    channel.current = tonweb.payments.createChannel({
      ...config,
      isA: false,
      myKeyPair: keyPairB,
      hisPublicKey: hisPublicKey,
    });
    const channelAddress = await channel.current.getAddress(); // address of this payment channel smart-contract in blockchain
    console.log("channelAddress=", channelAddress.toString(true, true, true));

    if (
      channelConfig.channelAddressA !==
      channelAddress.toString(true, true, true)
    ) {
      setStatus("channelAddressMismatched");
      return;
    }

    fullState.current = channelInitState;

    sendEvent("channelOpened");

    setStatus("channelOpen");
  };

  const fromWallet = () => {
    return channel.current.fromWallet({
      wallet: walletB,
      secretKey: keyPairB.secretKey,
    });
  };

  const packState = (state) => {
    return {
      balanceA: fromNano(state.balanceA),
      balanceB: fromNano(state.balanceB),
      seqnoA: state.seqnoA.toString(),
      seqnoB: state.seqnoB.toString(),
    };
  };

  const unpackState = (state) => {
    return {
      balanceA: toNano(state.balanceA),
      balanceB: toNano(state.balanceB),
      seqnoA: new BN(state.seqnoA),
      seqnoB: new BN(state.seqnoB),
    };
  };

  const spendBalanceA = (amount) => {
    return {
      balanceA: fullState.current.balanceA.sub(amount),
      balanceB: fullState.current.balanceB.add(amount),
      seqnoA: fullState.current.seqnoA.add(new BN("1")),
      seqnoB: fullState.current.seqnoB,
    };
  };

  const toUintArray = (values) => {
    return new Uint8Array(Object.values(values));
  };

  const sellSlot = async ({ slotId, signatureA }) => {
    const slot = slots.find((slot) => slot.id === slotId);

    if (!slot) {
      return;
    }

    const newState = spendBalanceA(new BN(slot.price));

    if (
      !(await channel.current.verifyState(newState, toUintArray(signatureA)))
    ) {
      throw new Error("Invalid A signature");
    }

    lastSignature.current = toUintArray(signatureA);
    fullState.current = newState;

    // Mark slot sold
    sendEvent("slotSold", { slotId });
  };

  const prepareStateClose = () => {
    return {
      balanceA: fullState.current.balanceA,
      balanceB: fullState.current.balanceB,
      seqnoA: fullState.current.seqnoA.add(new BN("1")),
      seqnoB: fullState.current.seqnoB.add(new BN("1")),
    };
  };

  const requestChannelClose = async () => {
    const channelStateClose = prepareStateClose();
    const closeSignature = await channel.current.signClose(channelStateClose);
    sendEvent("acceptCloseChannel", { closeSignature });
    setStatus("channelClosing");
  };

  const channelWasClosed = () => {
    fullState.current = prepareStateClose();
    setStatus("channelClosed");
  };

  const { channelId } = useParams();
  const { sendEvent } = useConnection(channelId, {
    requestSlots,
    shareChannelConfig,
    sellSlot,
    requestChannelClose,
    channelWasClosed,
  });

  return (
    <ArtistView
      status={status}
      slots={slots}
      setSlots={setSlots}
    />
  );
};

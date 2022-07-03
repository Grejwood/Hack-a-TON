import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useConnection } from "../../components/connection/useConnection";
import {
  getProvider,
  getWallet,
  toNano,
  fromNano,
  waitUntilState,
  waitUntilBalance,
} from "../../utils";
import { Button } from "react-bootstrap";
import BN from "bn.js";
import GuestView from "./GuestView";

export const Guest = () => {
  const providerRef = useRef(null);
  const tonweb = providerRef.current;
  const [config, setConfig] = useState({});
  const [slots, setSlots] = useState([]);
  const [walletAddressA, setWalletAddress] = useState(null);
  const [channelAddress, setChannelAddress] = useState(null);
  const [walletA, setWallet] = useState(null);
  const [keyPairA, setKeyPair] = useState(null);
  const [status, setStatus] = useState("notStarted");
  const channel = useRef(null);
  const fullState = useRef(null);

  const walletAddressB = config.walletAddressB;
  const publicKeyB = config.publicKeyB;

  useEffect(() => {
    setUp();
  }, []);

  const setUp = async () => {
    providerRef.current = getProvider();
    const [newKeyPair, wallet] = getWallet(
      providerRef.current,
      "H5794+0FVFs7QhS5JkKwFdbQWKyiEDv6bSFR6fUWHCQ="
    );
    setWallet(wallet);
    setKeyPair(newKeyPair);
    const walletAddress = await wallet.getAddress();
    setWalletAddress(walletAddress.toString(true, true, true));
  };

  const getChannelState = async () => {
    try {
      return await channel.current.getChannelState();
    } catch (e) {
      return null;
    }
  };

  const startChannel = async () => {
    setStatus("checkingBalance");
    // const balance = await tonweb.getBalance(walletAddressA);
    //
    // if (new BN(balance).lt(toNano("1"))) {
    //   setStatus("notStarted");
    //   alert("Not enough coins. Send at least 1 TON.");
    //   return;
    // }
    // new BN(balance).sub(toNano("1"))

    setStatus("startingChannel");

    const channelInitState = {
      balanceA: toNano("2"), // A's initial balance in Toncoins. Next A will need to make a top-up for this amount
      balanceB: toNano("0"), // B's initial balance in Toncoins. Next B will need to make a top-up for this amount
      seqnoA: new BN(0), // initially 0
      seqnoB: new BN(0), // initially 0
    };

    const channelConfig = {
      channelId: new BN(6), // Channel ID, for each new channel there must be a new ID
      addressA: new tonweb.Address(walletAddressA), // A's funds will be withdrawn to this wallet address after the channel is closed
      addressB: new tonweb.Address(walletAddressB), // B's funds will be withdrawn to this wallet address after the channel is closed
      initBalanceA: channelInitState.balanceA,
      initBalanceB: channelInitState.balanceB,
    };

    const hisPublicKey = new Uint8Array(Object.values(publicKeyB));

    channel.current = tonweb.payments.createChannel({
      ...channelConfig,
      isA: true,
      myKeyPair: keyPairA,
      hisPublicKey: hisPublicKey,
    });
    const channelAddress = await channel.current.getAddress(); // address of this payment channel smart-contract in blockchain
    setChannelAddress(channelAddress.toString(true, true, true));
    console.log("channelAddress=", channelAddress.toString(true, true, true));

    const fromWalletA = channel.current.fromWallet({
      wallet: walletA,
      secretKey: keyPairA.secretKey,
    });

    setStatus("deployingChannel");

    if ((await getChannelState()) == null) {
      console.log("deploying");
      await fromWalletA.deploy().send(toNano("0.05"));
    }

    if ((await getChannelState()) == null) {
      await waitUntilState(channel.current, 0);
    }

    setStatus("toppingUpChannel");
    console.log("ok");

    const currentBalanceA = (await channel.current.getData()).balanceA;
    const needTopup = channelInitState.balanceA.sub(currentBalanceA);

    if (needTopup.gt(new BN(0))) {
      const walletBalance = await tonweb.getBalance(walletAddressA);

      if (needTopup.gt(new BN(walletBalance))) {
        setStatus("notStarted");
        alert("You don't have enough coins on your wallet. Please send 2 TON.");
        return;
      }

      await fromWalletA
        .topUp({ coinsA: channelInitState.balanceA, coinsB: new BN(0) })
        .send(needTopup.add(toNano("0.05")));
    }

    await waitUntilBalance(
      channel.current,
      channelInitState.balanceA,
      new BN(0)
    );

    console.log("balance ok");

    setStatus("initingChannel");

    if ((await getChannelState()) === 0) {
      await fromWalletA.init(channelInitState).send(toNano("0.05"));
    }

    await waitUntilState(channel.current, 1);

    sendEvent("shareChannelConfig", {
      channelConfig: {
        channelId: channelConfig.channelId.toString(),
        walletAddressA,
        initBalanceA: fromNano(channelConfig.initBalanceA),
        publicKeyA: keyPairA.publicKey,
        channelAddressA: channelAddress.toString(true, true, true),
      },
    });

    fullState.current = channelInitState;
    console.log(packState(fullState.current));
  };

  const toUintArray = (values) => {
    return new Uint8Array(Object.values(values));
  };

  const fromWallet = () => {
    return channel.current.fromWallet({
      wallet: walletA,
      secretKey: keyPairA.secretKey,
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

  const channelOpened = () => {
    setStatus("channelOpen");
  };

  const buySlot = async (slot) => {
    const newState = spendBalanceA(new BN(slot.price));
    const signatureA = await channel.current.signState(newState);

    sendEvent("sellSlot", {
      slotId: slot.id,
      signatureA,
    });
  };

  const spendBalanceA = (amount) => {
    return {
      balanceA: fullState.current.balanceA.sub(amount),
      balanceB: fullState.current.balanceB.add(amount),
      seqnoA: fullState.current.seqnoA.add(new BN("1")),
      seqnoB: fullState.current.seqnoB,
    };
  };

  const prepareStateClose = () => {
    return {
      balanceA: fullState.current.balanceA,
      balanceB: fullState.current.balanceB,
      seqnoA: fullState.current.seqnoA.add(new BN("1")),
      seqnoB: fullState.current.seqnoB.add(new BN("1")),
    };
  };

  const slotSold = ({ slotId }) => {
    const soldSlot = slots.find((slot) => slot.id === slotId);

    if (!soldSlot) {
      return;
    }

    fullState.current = spendBalanceA(new BN(soldSlot.price));

    markSold(slotId);
  };

  const markSold = (slotId) => {
    setSlots((current) =>
      current.map((slot) => {
        if (slot.id === slotId) {
          return {
            ...slot,
            isSold: true,
          };
        } else {
          return slot;
        }
      })
    );
  };

  const closeChannel = () => {
    sendEvent("requestChannelClose");
  };

  const acceptCloseChannel = async ({ closeSignature }) => {
    const channelStateClose = prepareStateClose();
    const closeSig = toUintArray(closeSignature);

    if (!(await channel.current.verifyClose(channelStateClose, closeSig))) {
      throw new Error("Invalid close B signature");
    }

    setStatus("channelClosing");

    await fromWallet()
      .close({ ...channelStateClose, hisSignature: closeSig })
      .send(toNano("0.05"));

    await waitUntilState(channel.current, 0);

    fullState.current = channelStateClose;
    setStatus("channelClosed");
    sendEvent("channelWasClosed");
  };

  useEffect(() => {
    sendEvent("requestSlots");
  }, []);

  const availableSlots = (config) => {
    setConfig(config);
    setSlots(config.slots);
  };

  const { channelId } = useParams();
  const { sendEvent } = useConnection(channelId, {
    availableSlots,
    channelOpened,
    slotSold,
    acceptCloseChannel,
  });

  return (
    <GuestView
      status={status}
      walletAddressA={walletAddressA}
      startChannel={startChannel}
      closeChannel={closeChannel}
      channelAddress={channelAddress}
      fullState={fullState}
      buySlot={buySlot}
      slots={slots}
    />
  );
};

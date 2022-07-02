import { useEffect, useRef } from "react";
import Pusher from "pusher-js";
import axios from "axios";

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const useConnection = (channelId, onEvent) => {
  const pusherRef = useRef();
  const clientId = useRef(makeid(12));

  useEffect(() => {
    const newPusher = new Pusher("ae58f5c5e4c0cca87aa1", {
      cluster: "eu",
    });

    newPusher.connection.bind("error", function (err) {
      console.log("Error: ", err);
    });

    const channel = newPusher.subscribe(channelId);
    channel.bind("event", function (event) {
      if (event.client !== clientId.current) {
        onEvent(event.message);
      }
    });

    pusherRef.current = newPusher;

    return () => {
      newPusher.disconnect();
    };
  }, []);

  const sendMessage = async (channel, event, message) => {
    await axios.get(
      "https://dczr4t4laf.execute-api.eu-central-1.amazonaws.com/demo/helloworld",
      {
        params: {
          channel,
          event,
          data: window.btoa(JSON.stringify(message)),
        },
      }
    );
  };

  const sendEvent = async (message) => {
    await sendMessage(channelId, "event", {
      message,
      client: clientId.current,
    });
  };

  return {
    sendEvent,
  };
};

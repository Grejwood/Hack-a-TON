import { useEffect, useRef } from "react";
import Pusher from "pusher-js";
import axios from "axios";

export function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const useConnection = (channelId, handlers = {}) => {
  const pusherRef = useRef();
  const clientId = useRef(makeid(12));
  const privateHandlers = useRef(handlers);

  useEffect(() => {
    privateHandlers.current = handlers;
  }, [handlers]);

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
        const handler = privateHandlers.current[event.type];
        if (handler) {
          handler(event.message);
        }
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

  const sendEvent = async (type, message) => {
    await sendMessage(channelId, "event", {
      type,
      message,
      client: clientId.current,
    });
  };

  return {
    sendEvent,
  };
};

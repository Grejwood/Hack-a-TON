import React, { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { useConnection } from "../../components/connection/useConnection";
import { useParams } from "react-router-dom";

export const Channel = () => {
  const [value, setValue] = useState("");

  const onMessage = (message) => {
    console.log(message);
  };

  const onClick = () => {
    sendEvent(value);
  };

  const { channelId } = useParams();
  const { sendEvent } = useConnection(channelId, onMessage);

  return (
    <div>
      <FormControl value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={onClick}>Signal</Button>
    </div>
  );
};

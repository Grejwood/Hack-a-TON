import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Home from "../../../pages/Home";
import Guest from "../../../pages/Guest";
import NotFound from "../../../pages/NotFound";
import { Channel } from "../../../pages/Channel";

const AppRouter = (props) => {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/guest" element={<Guest />} />
      <Route exact path="/channel/:channelId" element={<Channel />} />
    </Routes>
  );
};

export default AppRouter;

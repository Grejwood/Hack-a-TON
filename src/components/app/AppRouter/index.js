import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Home from "../../../pages/Home";
import About from "../../../pages/Profile";
import NotFound from "../../../pages/NotFound";
import { Channel } from "../../../pages/Channel";

const AppRouter = (props) => {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/profile" element={<About />} />
      <Route exact path="/channel/:channelId" element={<Channel />} />
    </Routes>
  );
};

export default AppRouter;

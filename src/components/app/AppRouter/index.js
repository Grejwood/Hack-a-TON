import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "../../../pages/Landing";
import { Artist } from "../../../pages/Artist";
import { Guest } from "../../../pages/Guest";

const AppRouter = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Landing />} />
      <Route exact path="/artist/:channelId" element={<Artist />} />
      <Route exact path="/guest/:channelId" element={<Guest />} />
    </Routes>
  );
};

export default AppRouter;

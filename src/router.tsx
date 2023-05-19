import React from "react";

import {Routes, Route} from "react-router";

import Home from "./pages/Home";
import MyCalls from "./pages/MyCalls";
import AddMoney from "./pages/AddMoney";
import Register from "./pages/Register";
import VideoChat from "./pages/VideoChat";
import RequestCall from "./pages/RequestCall";
import CallRequests from "./pages/CallRequests";


const AppRouter = (): JSX.Element => {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/my-calls" element={<MyCalls />} />
      <Route path="/register" element={<Register />} />
      <Route path="/add-money" element={<AddMoney />} />
      <Route path="/video-chat" element={<VideoChat />} />
      <Route path="/request-call" element={<RequestCall />} />
      <Route path="/call-requests" element={<CallRequests />} />
    </Routes>
  );

};


export default AppRouter;

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouterConfigs from "./routes/route-config";
import { toast, Toaster } from "sonner";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import ContextProvider from "./provider/contextProvider";
import io from "socket.io-client";
import SocketComponent from "./components/SocketComponent";

const socket = io("http://localhost:5000");

const App = () => {
  return (
    <ContextProvider>
      <BrowserRouter>
        <SocketComponent />
        <RouterConfigs />
        <Toaster position="top-center" richColors theme="light" />
      </BrowserRouter>
    </ContextProvider>
  );
};

export default App;

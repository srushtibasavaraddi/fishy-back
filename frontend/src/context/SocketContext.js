import socketio from "socket.io-client";
import React from "react";
export const socket = socketio.connect(
  '"https://shielded-escarpment-35022.herokuapp.com/:9000"'
);
export const SocketContext = React.createContext();

import io from "socket.io-client";
import React from "react";
export const socket = io("http://54.176.18.38:5001/);
export const SocketContext = React.createContext();

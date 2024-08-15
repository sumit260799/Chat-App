import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  setSocketData,
  setMsgSeenResponse,
  setSeenSuccessResponse,
  deleteMessageResponse,
} from "../features/userSlice";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [socketMessage, setSocketMessage] = useState(null);
  const [typingMessage, setTypingMessage] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:9000/");
    setSocket(newSocket);

    newSocket.on("getMessage", (data) => {
      setSocketMessage(data);
      dispatch(setSocketData(data));
    });

    newSocket.on("msgSeenResponse", (msg) => {
      dispatch(setMsgSeenResponse(msg));
    });
    newSocket.on("deleteMessageResponse", (data) => {
      dispatch(deleteMessageResponse(data));
    });

    newSocket.on("seenSuccess", (data) => {
      dispatch(setSeenSuccessResponse(data));
    });

    newSocket.on("typingMessage", (data) => {
      setTypingMessage(data);
    });
    newSocket.on("getUsers", (user) => {
      setActiveUser(user);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        activeUser,
        socketMessage,
        setSocketMessage,
        typingMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

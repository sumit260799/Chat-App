import React, { useRef, useEffect, useState, useContext } from "react";
import {
  MdCall,
  MdVideoCall,
  MdImage,
  MdAttachFile,
  MdInsertEmoticon,
} from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import { AiOutlineSend } from "react-icons/ai";
import Message from "./Message";
import { useSelector, useDispatch } from "react-redux";
import {
  sendMessage,
  getMessages,
  getLastMessage,
} from "../features/userSlice";
import { SocketContext } from "../context/SocketContext";
import useSound from "use-sound";
import sendS from "../audio/send.mp3";
import {
  messageSendSuccessClear,
  imgMessageSendSuccessClear,
} from "../features/userSlice";
import ImgSendComponent from "./ImgSendComponent";
import UserProfile from "./UserProfile";
import { deleteMessageClear } from "../features/messageSlice";
import EmojiBox from "./EmojiBox";

const ChatArea = ({ activeUser, handleBackToSidebar }) => {
  const { user, selectedUser } = useSelector((state) => state.auth);
  const {
    deleteMessageGet,
    messages,
    messageSendSuccess,
    imgMessageSendSuccess,
    lastMessage,
  } = useSelector((state) => state.user);
  const { socket, typingMessage, socketMessage } = useContext(SocketContext);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const fileBoxRef = useRef(null);
  const emojiBoxRef = useRef(null);
  const inputRef = useRef(null);
  const userProfileRef = useRef(null);
  const dispatch = useDispatch();
  const [showEmojis, setShowEmojis] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachFile, setAttachFile] = useState(false);
  const [sendSPlay] = useSound(sendS);
  const [userProfile, setUserProfile] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  useEffect(() => {
    // dispatch(getLastMessage(user?.id));
  }, [socketMessage]);

  useEffect(() => {
    if (deleteMessageGet) {
      dispatch(
        getMessages({ senderId: user.id, receiverId: selectedUser?._id })
      );
    }
    dispatch(deleteMessageClear());
  }, [deleteMessageGet]);

  useEffect(() => {
    if (typingMessage && typingMessage.senderId === selectedUser?._id) {
      setIsTyping(typingMessage.msg.length > 0);
    }
  }, [typingMessage, selectedUser?._id]);

  useEffect(() => {
    if (messageSendSuccess) {
      if (socket && messages.length > 0) {
        socket.emit("sendMessage", messages[messages.length - 1]);
      }
      dispatch(messageSendSuccessClear());
    }
  }, [messageSendSuccess]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiBoxRef.current &&
        !emojiBoxRef.current.contains(event.target) &&
        !event.target.closest(".emoji-button") &&
        !event.target.closest(".switch-button")
      ) {
        setShowEmojis(false);
      }

      if (
        fileBoxRef.current &&
        !fileBoxRef.current.contains(event.target) &&
        !event.target.closest(".switch-button")
      ) {
        setAttachFile(false);
        document.body.style.overflow = "auto";
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fileBoxRef, emojiBoxRef]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleEmojiPicker = () => {
    setShowEmojis((prevShowEmojis) => !prevShowEmojis);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userProfileRef.current &&
        !userProfileRef.current.contains(event.target) &&
        !event.target.closest(".switch-button")
      ) {
        setUserProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userProfileRef]);

  const emojiSend = (e) => {
    setMessage((prevMessage) => `${prevMessage}${e}`);
    if (socket) {
      socket.emit("typingMessage", {
        senderId: user.id,
        receiverId: selectedUser?._id,
        msg: `${message}${e}`,
      });
    }
  };

  const inputhandle = (e) => {
    setMessage(e.target.value);
    if (socket) {
      socket.emit("typingMessage", {
        senderId: user.id,
        receiverId: selectedUser?._id,
        msg: e.target.value,
      });
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    sendSPlay();
    const data = {
      senderId: user.id,
      senderName: user.username,
      receiverId: selectedUser._id,
      receiverName: selectedUser.username,
      message: { text: message, image: "" },
      status: "delivered",
      time: new Date(),
    };
    await dispatch(sendMessage(data));
    await dispatch(
      getMessages({ senderId: user.id, receiverId: selectedUser?._id })
    );
    setMessage("");
    if (socket) {
      socket.emit("typingMessage", {
        senderId: user.id,
        receiverId: selectedUser?._id,
        msg: "",
      });
    }
    // dispatch(getLastMessage(user?.id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleClick(e);
    }
  };

  if (!selectedUser) {
    return (
      <div className="h-full bg-gray-100 dark:bg-gray-700 p-3 transition-transform duration-300 hidden sm:block">
        <p className="text-center text-gray-600 dark:text-gray-100 flex items-center justify-center h-full">
          Select a user to start chatting
        </p>
      </div>
    );
  }

  return (
    <div
      className={`h-full flex flex-col transition-transform duration-300 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white ${
        selectedUser ? "block w-full" : "hidden sm:block"
      }`}
    >
      <div className="flex flex-col h-[100vh] relative ">
        <div
          ref={userProfileRef}
          className={`${
            userProfile ? "user-container" : "hide-user-container"
          } absolute top-0 left-0 z-50`}
        >
          {userProfile && <UserProfile selectedUser={selectedUser} />}
        </div>
        <div className="absolute bottom-1 z-50">
          {attachFile && (
            <div ref={fileBoxRef}>
              <ImgSendComponent setAttachFile={setAttachFile} />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-2 sm:px-6 p-2 sm:mb-0 border-b border-gray-300 bg-gray-200 dark:bg-transparent pb-2 dark:border-none">
          <div className="flex justify-center items-center">
            <button className="sm:hidden mb-0" onClick={handleBackToSidebar}>
              <IoIosArrowRoundBack className="text-gray-800 dark:text-white text-3xl" />
            </button>
            <div
              onClick={() => setUserProfile(true)}
              className="flex items-center justify-center cursor-pointer select-none"
            >
              <img
                src={selectedUser?.image}
                alt="Profile"
                className="w-12 h-12 min-[900px]:w-[3.2rem] min-[900px]:h-[3.2rem] rounded-full object-fill mr-4"
              />
              <div className="chat-text">
                {selectedUser?._id === user?.id ? (
                  <h2 className="text-lg sm:text-xl capitalize tracking-wider h-5 sm:h-6">
                    {selectedUser?.username} (You)
                  </h2>
                ) : (
                  <h2 className="text-lg sm:text-xl capitalize tracking-wider">
                    {selectedUser?.username}
                  </h2>
                )}
                {isTyping ? (
                  <p className="text-blue-500">typing...</p>
                ) : activeUser &&
                  activeUser.some((a) => a.userId === selectedUser?._id) ? (
                  <p className="text-green-500">online</p>
                ) : (
                  <p className="text-gray-800 dark:text-white">offline</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="border border-gray-400 dark:border-none dark:bg-gray-50 rounded-full p-1 sm:p-2">
              <MdCall className="text-gray-800 text-2xl" />
            </button>
            <button className="border border-gray-400 dark:border-none dark:bg-gray-50 rounded-full p-1 sm:p-2">
              <MdVideoCall className="text-gray-800 text-2xl" />
            </button>
          </div>
        </div>
        <div className="custom-scrollbar flex-grow h-0 sm:rounded-lg shadow overflow-y-auto mb-4 p-4 sm:mx-6 bg-gray-100 dark:bg-gray-700">
          <Message scrollRef={scrollRef} />
        </div>
        <div className="relative ">
          <div className="flex items-center bg-white dark:bg-gray-700 py-1 sm:px-5 px-1">
            <button
              className="text-gray-600 dark:text-gray-100 sm:p-1 ml-2 emoji-button"
              onClick={toggleEmojiPicker}
            >
              <MdInsertEmoticon className="text-2xl sm:text-2xl" />
            </button>
            <button
              onClick={() => setAttachFile(!attachFile)}
              className="text-gray-600 dark:text-gray-100 sm:p-1 ml-2"
            >
              <MdAttachFile className="text-2xl sm:text-2xl" />
            </button>
            <input
              ref={inputRef}
              onKeyDown={handleKeyDown}
              type="text"
              value={message}
              placeholder="Type a message..."
              onChange={inputhandle}
              className="w-full bg-white dark:bg-gray-700 px-2 sm:px-4 text-xl rounded-full focus:outline-none py-2"
            />
            {message.length > 0 && (
              <button
                type="submit"
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                className="text-white dark:text-black px-4 ml-0 rounded-full"
              >
                <AiOutlineSend className="text-2xl dark:text-white text-gray-800" />
              </button>
            )}
          </div>
          {showEmojis && (
            <div
              ref={emojiBoxRef}
              className="absolute sm:left-4 bottom-9 mb-2 sm:p-2 flex flex-wrap  "
            >
              <EmojiBox emojiSend={emojiSend} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatArea;

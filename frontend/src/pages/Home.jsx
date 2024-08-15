import React, { useContext, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import useSound from "use-sound";
import moment from "moment";
import {
  getFriends,
  getLastMessage,
  seenMessage,
  getMessages,
  messageGetSuccessClear,
} from "../features/userSlice";
import { getDeleteFdMessages } from "../features/messageSlice";
import ChatArea from "../components/ChatArea";
import Switch from "../components/Switch";
import { SocketContext } from "../context/SocketContext";
import { IoCheckmark } from "react-icons/io5";
import { FcGallery } from "react-icons/fc";

import receiveS from "../audio/receive.mp3";
import notificationS from "../audio/notification.mp3";
import { updateState } from "../features/userSlice";
import { LiaCheckDoubleSolid } from "react-icons/lia";
import Profile from "../components/Profile";
import { useUserContext } from "../context/UserContext";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket, activeUser, socketMessage, setSocketMessage } =
    useContext(SocketContext);
  const { viewImage } = useUserContext();

  const [receiveSPlay] = useSound(receiveS);
  const [notificationSPlay] = useSound(notificationS);

  const { loading, user, selectedUser, authenticate } = useSelector(
    (state) => state.auth
  );

  const { friends, messages, message_get_success, lastMessage } = useSelector(
    (state) => state.user
  );

  const { deleteMessages } = useSelector((state) => state.message);

  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    dispatch(getFriends());
  }, [user]);

  useEffect(() => {
    dispatch(getDeleteFdMessages());
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("addUser", user.id, user);
    }
  }, [socket, user]);

  useEffect(() => {
    if (!authenticate) {
      navigate("/messenger/register");
    }
  }, [authenticate, navigate]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(
        getMessages({ senderId: user.id, receiverId: selectedUser?._id })
      );
    }
  }, [selectedUser]);

  // console.log("messages[messages.length - 1]", messages[messages.length - 1]);

  useEffect(() => {
    if (messages.length > 0) {
      if (
        messages[messages.length - 1]?.senderId !== user.id &&
        messages[messages.length - 1]?.status !== "seen"
      ) {
        dispatch(updateState(selectedUser?._id));
        if (socket) {
          socket.emit("seen", {
            senderId: selectedUser?._id,
            receiverId: user.id,
          });
        }
        dispatch(seenMessage({ _id: messages[messages.length - 1]?._id }));
      }
    }
    dispatch(messageGetSuccessClear());
  }, [message_get_success]);

  // console.log("message_get_success", message_get_success);

  useEffect(() => {
    if (socketMessage && selectedUser) {
      if (
        socketMessage.senderId === selectedUser._id &&
        socketMessage.receiverId === user.id
      ) {
        receiveSPlay();
        socket.emit("messageSeen", socketMessage);
        dispatch(seenMessage(socketMessage));
      }
    }
    setSocketMessage("");
  }, [socketMessage]);

  useEffect(() => {
    if (
      socketMessage &&
      socketMessage.senderId !== selectedUser?._id &&
      socketMessage.receiverId === user.id
    ) {
      notificationSPlay();
      toast.success(`${socketMessage.senderName} sent a message`);
    }
  }, [socketMessage]);

  const handleUserSelect = async (user) => {
    await dispatch(setSelectedUser(user));
  };

  const handleBackToSidebar = async () => {
    await dispatch(setSelectedUser(null));
  };

  const formatTimestamp = (timestamp) => {
    const today = moment().startOf("day");
    const messageDate = moment(timestamp);

    if (today.isSame(messageDate, "day")) {
      return moment(timestamp).format("hh:mm A");
    } else if (today.subtract(1, "days").isSame(messageDate, "day")) {
      return "Yesterday " + moment(timestamp).format("hh:mm A");
    } else {
      return moment(timestamp).format("DD-MM hh:mm A");
    }
  };

  const isEmoji = (text) => {
    const regex =
      /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FC00}-\u{1FFFD}\u{1FFFE}\u{1FFFF}]+$/u;
    return regex.test(text);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  if (loading) {
    return (
      <div className="w-[100vw] h-[95vh] flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }

  const sortedFriends = friends?.friends
    ?.filter((fd) => fd.username.includes(search))
    ?.sort((a, b) => {
      const aActive =
        activeUser && activeUser.some((au) => au.userId === a._id);
      const bActive =
        activeUser && activeUser.some((au) => au.userId === b._id);
      return bActive - aActive;
    });
  return (
    <section className="flex  h-screen w-[100vw]">
      {/* Profile Section */}
      <Toaster />
      <div
        className={` bg-gray-200 dark:bg-gray-900  relative transition-transform duration-300 min-w-[270px] sm:w-1/4 w-full sm:block z-10  select-none ${
          selectedUser ? "hidden" : "block"
        }`}
      >
        <div className="w-full flex flex-1 justify-between items-center select-none  border-t dark:border-black border-gray-300 absolute bottom-0 right-0 left-0  p-2  ">
          <div
            className="flex flex-1 items-center w-full h-full cursor-pointer  px-2 rounded-lg"
            onClick={() => setProfile(!profile)}
          >
            <img
              className="w-8 h-8 ring-1 ring-slate-100 shadow-md object-fill rounded-full mr-2"
              src={user?.image}
              alt="none"
            />
            <div>
              <h1 className="text-gray-800 select-none dark:text-white capitalize text-lg">
                {user?.username}
              </h1>
            </div>
          </div>
          <div className="switch-button">
            <Switch />
          </div>
        </div>

        <div className="flex items-center px-2 my-2">
          <input
            type="search"
            placeholder="Search..."
            className="border border-gray-400 dark:border-none bg-transparent dark:bg-gray-700 text-gray-800 dark:text-white rounded-md px-4 py-2 focus:outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <h2 className="text-gray-800 dark:text-white text-lg mb-2 px-2">
          Friends
        </h2>
        <div className="max-h-[80vh]  px-2 flex-grow custom-scrollbar overflow-y-auto">
          {sortedFriends &&
            sortedFriends.map((friend) => {
              const { _id, email, image, username } = friend;

              const findUser = lastMessage.filter(
                (l1) =>
                  !deleteMessages.some((l2) => l2.messageId === l1.msg?._id)
              );
              const lastMsg = findUser?.find((msg) => msg.friendId === _id);

              const textMessage = lastMsg?.msg?.message?.text;
              const imageMessage = lastMsg?.msg?.message?.image;

              const createdAt = lastMsg?.msg?.createdAt;
              const senderId = lastMsg?.msg?.senderId;
              const senderName = lastMsg?.msg?.senderName;
              const status = lastMsg?.msg?.status;

              let displayMessage;
              if (textMessage) {
                displayMessage = isEmoji(textMessage)
                  ? textMessage.substring(0, 10)
                  : textMessage.substring(0, 25);
              }

              return (
                <div
                  key={_id}
                  className={`flex items-center justify-between p-2 my-1 dark:hover:bg-gray-800 hover:bg-gray-300 duration-300 rounded-md cursor-pointer ${
                    selectedUser && selectedUser._id === _id
                      ? "dark:bg-gray-700 bg-gray-300"
                      : ""
                  }`}
                  onClick={() => handleUserSelect(friend)}
                >
                  <div className="flex items-center relative w-full select-none">
                    <img
                      src={image}
                      alt="none"
                      className="w-12 h-12 rounded-full object-fill mr-3"
                    />
                    {activeUser && activeUser.some((a) => a.userId === _id) && (
                      <span className="absolute bottom-0 left-15 w-3 h-3 bg-green-500 rounded-full border border-white dark:border-gray-900"></span>
                    )}
                    <div className="flex flex-col justify-center w-full">
                      <div className="flex justify-between items-center w-full mb-[-1px]">
                        <h1 className="text-gray-800 dark:text-white select-none capitalize text-base font-semibold">
                          {username} {_id === user?.id && "(You)"}
                        </h1>
                        <span className="text-sm chat-text text-gray-500 dark:text-gray-400">
                          {(textMessage && formatTimestamp(createdAt)) ||
                            (imageMessage && formatTimestamp(createdAt))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        {lastMsg && (
                          <div className="flex items-center justify-between ">
                            {user.id !== senderId &&
                            status === "delivered" &&
                            status !== undefined ? (
                              <div className="">
                                {imageMessage ? (
                                  <div className="flex items-center gap-x-1">
                                    <FcGallery />
                                    <span className="text-green-500 dark:text-green-400">
                                      image
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-green-500 dark:text-green-400">
                                    {displayMessage}
                                  </span>
                                )}
                                {textMessage &&
                                  displayMessage.length > 20 &&
                                  "..."}
                              </div>
                            ) : (
                              <div className="">
                                {imageMessage ? (
                                  <div className="flex items-center gap-x-1">
                                    <FcGallery className="" />
                                    <span className="text-cyan-400 dark:text-cyan-500">
                                      image
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-cyan-500 dark:text-cyan-400">
                                    {displayMessage}
                                  </span>
                                )}
                                {textMessage &&
                                  displayMessage.length > 20 &&
                                  "..."}
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          {lastMessage && senderId === user.id ? (
                            status === "delivered" ? (
                              <span>
                                <IoCheckmark className="dark:text-white text-gray-900" />
                              </span>
                            ) : status === "seen" ? (
                              <span>
                                <LiaCheckDoubleSolid className="text-cyan-500 font-bold text-xl" />
                              </span>
                            ) : (
                              ""
                            )
                          ) : (
                            <div>
                              {status !== undefined && status !== "seen" ? (
                                <div className="seen-icon bg-green-500 w-3 h-3 rounded-full"></div>
                              ) : (
                                ""
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {/* Chat Section */}
      <div
        className={` sm:w-3/4 w-full ${
          selectedUser ? "block " : "hidden"
        } sm:block`}
      >
        <ChatArea
          activeUser={activeUser}
          handleBackToSidebar={handleBackToSidebar}
        />
      </div>
      {/* profile */}
      {profile && (
        <div
          ref={profileRef}
          className={`${
            profile ? "show-container" : "hide-container"
          }  fixed min-w-[330px]  w-full ${
            viewImage && "h-full"
          } sm:w-1/4 bottom-0 z-50 `}
        >
          <Profile profile={profile} user={user} />
        </div>
      )}
    </section>
  );
};

export default Home;

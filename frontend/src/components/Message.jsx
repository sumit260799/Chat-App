import React, { useState, useRef, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoArrowDown } from "react-icons/go";
import moment from "moment";
import { getMessages, getLastMessage } from "../features/userSlice";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PreviewImage from "./PreviewImage";
import {
  deleteFdMsgByUser,
  getDeleteFdMessages,
  deleteMsgForEveryOne,
  deleteMessageClear,
} from "../features/messageSlice";
import {} from "../features/userSlice";
import ContextMenuFriend from "./ContextMenuFriend";
import ContextMenuCurrentUser from "./ContextMenuCurrentUser";
import { SocketContext } from "../context/SocketContext";
import { useUserContext } from "../context/UserContext";

const Message = ({ scrollRef }) => {
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext);
  const { user, selectedUser } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.user);

  const { viewImage, setViewImage } = useUserContext();

  const { deleteMessages, deleteMessageGet } = useSelector(
    (state) => state.message
  );

  const [messageId, setMessageId] = useState(null);

  const profileRef = useRef(null);
  const contextMenuRef = useRef(null);
  const [activeMessage, setActiveMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target) &&
        !event.target.closest(".switch-button") &&
        !event.target.closest(".dot-btn")
      ) {
        setActiveMessage(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenuRef]);

  useEffect(() => {
    if (deleteMessageGet) {
      dispatch(getDeleteFdMessages());
    }
    dispatch(getMessages({ senderId: user.id, receiverId: selectedUser?._id }));
    dispatch(getLastMessage(user?.id));
    dispatch(deleteMessageClear());
  }, [deleteMessageGet]);

  const setToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const openImagePreview = (imageUrl) => {
    setViewImage(imageUrl);
  };

  const closeImagePreview = () => {
    setViewImage(null);
  };
  const handleDelete = async (id) => {
    const data = {
      messageId: id,
      userName: user.username,
      userId: user.id,
    };
    await dispatch(deleteFdMsgByUser(data));
  };
  const handleDeleteForMe = async (id) => {
    const data = {
      messageId: id,
      userName: user.username,
      userId: user.id,
    };
    await dispatch(deleteFdMsgByUser(data));
  };

  const handleDeleteForEveryone = async (id) => {
    const data = {
      mid: id,
      senderId: user.id,
      receiverId: selectedUser?._id,
    };
    await dispatch(deleteMsgForEveryOne(id));
    await socket.emit("deleteMessage", data);
    setShowDeleteModal(false);
  };
  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="flex justify-center items-center my-12">
      <div className="w-full p-0 sm:p-2 h-full flex flex-col">
        <div className="flex-grow space-y-2">
          {messages &&
            messages.length > 0 &&
            messages.map((m, index) => {
              const isCurrentUser = m?.senderId === user.id;
              const isNotCurrentUser = m?.senderId === selectedUser?._id;

              const messageClass = isCurrentUser
                ? "justify-end animate-slide-in-right"
                : "justify-start animate-slide-in-left";

              return (
                <div
                  key={index}
                  className={`mb-4 flex items-center ${messageClass}`}
                >
                  {isCurrentUser &&
                    !deleteMessages.some(
                      (dm) => dm.messageId === m._id && m.senderId === dm.userId
                    ) && (
                      <div className="flex w-full justify-end items-start gap-0 my-2">
                        <div
                          className="flex justify-center items-center relative"
                          onMouseEnter={() => setMessageId(m._id)}
                          onMouseLeave={() => setMessageId(null)}
                        >
                          <div ref={contextMenuRef} className="relative">
                            {activeMessage === m._id && (
                              <ContextMenuCurrentUser
                                handleDeleteForMe={() =>
                                  handleDeleteForMe(m._id)
                                }
                                handleDeleteForEveryone={() =>
                                  handleDeleteForEveryone(m._id)
                                }
                                setShowDeleteModal={setShowDeleteModal}
                                showDeleteModal={showDeleteModal}
                                handleCloseModal={handleCloseModal}
                              />
                            )}
                          </div>

                          <div>
                            {messageId === m._id && (
                              <div
                                ref={profileRef}
                                className="relative text-sm font-medium"
                                type="button"
                              >
                                <button onClick={() => setActiveMessage(m._id)}>
                                  <HiOutlineDotsVertical className="dark:bg-gray-700 rounded-md text-2xl p-1 m-1 active:ring-2 ring-gray-900 text-gray-800 dark:text-white cursor-pointer" />
                                </button>
                              </div>
                            )}
                          </div>
                          {/* message */}
                          <div className="flex justify-center items-center">
                            <div className="max-w-[300px] sm:max-w-xs flex flex-col select-none p-2 sm:px-3 border-gray-200 bg-gray-300 rounded-s-xl rounded-ee-xl dark:bg-gray-800 min-w-[80px]">
                              {m.message.images &&
                                m.message.images.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {m.message.images.map((image, index) => {
                                      const fileExtension = image.url
                                        .split(".")
                                        .pop()
                                        .toLowerCase();

                                      return (
                                        <React.Fragment key={index}>
                                          {fileExtension === "pdf" ? (
                                            <embed
                                              src={image.url}
                                              type="application/pdf"
                                              width="100%"
                                              height="250px"
                                              className="rounded-lg max-w-[200px] lg:max-w-full max-h-[250px] min-w-[100px] sm:max-h-[300px] sm:min-w-[150px] object-cover select-none cursor-pointer"
                                              onClick={() =>
                                                openImagePreview(image.url)
                                              }
                                              onContextMenu={(e) =>
                                                e.preventDefault()
                                              }
                                            />
                                          ) : (
                                            <img
                                              src={image.url}
                                              alt={`Message Image ${index + 1}`}
                                              className="rounded-lg max-w-[200px] lg:max-w-full max-h-[250px] min-w-[100px] sm:max-h-[300px] sm:min-w-[150px] object-cover select-none cursor-pointer"
                                              onClick={() =>
                                                openImagePreview(image.url)
                                              }
                                              onContextMenu={(e) =>
                                                e.preventDefault()
                                              }
                                            />
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                  </div>
                                )}

                              <p className="text-sm font-normal py-0 text-gray-900 dark:text-white">
                                {m.message.text || m.message.caption}
                              </p>
                              <span className="text-xs font-normal text-gray-500 dark:text-gray-400 font-sans flex justify-end">
                                {formatTimestamp(m.createdAt)}
                              </span>
                            </div>
                            <img
                              className="w-12 h-12 ml-4 object-cover rounded-full hidden lg:block select-none"
                              src={user?.image}
                              alt=" image"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                  {isNotCurrentUser &&
                    !deleteMessages.some(
                      (dm) => dm.messageId === m._id && m.senderId !== dm.userId
                    ) && (
                      <div
                        onMouseEnter={() => setMessageId(m._id)}
                        onMouseLeave={() => setMessageId(null)}
                        className="flex w-full items-start select-none gap-0 my-2"
                      >
                        <div className="flex justify-center items-center relative">
                          <img
                            className="w-12 h-12 mr-4 object-cover rounded-full hidden lg:block select-none"
                            src={selectedUser?.image}
                            alt=" image"
                          />
                          <div className="max-w-[300px] sm:max-w-xs flex flex-col select-none p-2 sm:px-3 border-gray-200 bg-gray-300 rounded-e-xl rounded-es-xl dark:bg-gray-800 min-w-[80px]">
                            {m.message.images &&
                              m.message.images.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {m.message.images.map((image, index) => (
                                    <img
                                      key={index}
                                      src={image.url}
                                      alt={`Message Image ${index + 1}`}
                                      className="rounded-lg max-w-[200px] lg:max-w-full max-h-[250px] min-w-[100px] sm:max-h-[300px] sm:min-w-[150px] object-cover select-none cursor-pointer"
                                      onClick={() =>
                                        openImagePreview(image.url)
                                      }
                                    />
                                  ))}
                                </div>
                              )}

                            <p className="text-sm font-normal py-0 text-gray-900 dark:text-white">
                              {m.message.text || m.message.caption}
                            </p>
                            <span className="text-xs font-normal text-gray-500 dark:text-gray-400 font-sans flex justify-end">
                              {formatTimestamp(m.createdAt)}
                            </span>
                          </div>
                          {messageId === m._id && (
                            <div
                              ref={profileRef}
                              className="relative inline-flex self-center items-center text-sm font-medium"
                              type="button"
                            >
                              <button onClick={() => setActiveMessage(m._id)}>
                                <HiOutlineDotsVertical className="dot-btn dark:bg-gray-700 rounded-md text-2xl p-1 m-1 active:ring-2 ring-gray-900 text-gray-800 dark:text-white cursor-pointer" />
                              </button>
                            </div>
                          )}

                          {activeMessage === m._id && (
                            <div
                              ref={contextMenuRef}
                              className="absolute right-[-40px]"
                            >
                              <ContextMenuFriend
                                handleDelete={() => handleDelete(m._id)}
                                handleDeleteForMe={() =>
                                  handleDeleteForMe(m._id)
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              );
            })}
        </div>
        <div ref={scrollRef}></div>
        <div className="flex justify-end">
          {/* Additional UI elements can be added here */}
        </div>
      </div>

      {viewImage && (
        <PreviewImage
          closeImagePreview={closeImagePreview}
          previewImage={viewImage}
        />
      )}

      <button
        onClick={setToBottom}
        className="fixed bottom-[3.7rem] right-3 sm:right-7 dark:bg-white dark:text-gray-900 bg-gray-900 text-white duration-300 shadow-2xl rounded-lg p-1"
      >
        <GoArrowDown className="text-xl md:text-2xl font-semibold" />
      </button>
    </div>
  );
};

export default Message;

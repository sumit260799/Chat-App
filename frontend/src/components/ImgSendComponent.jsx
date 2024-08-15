import React, { useState, useRef } from "react";
import { MdClose } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { IoIosDocument } from "react-icons/io";
import { FaCamera } from "react-icons/fa";
import { BiSolidVideos } from "react-icons/bi";
import { IoMdPhotos } from "react-icons/io";
import { MdInsertEmoticon } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import EmojiBox from "./EmojiBox";
import {
  sendImageData,
  getMessages,
  getLastMessage,
} from "../features/userSlice";

const ImgSendComponent = ({ setAttachFile }) => {
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const [caption, setCaption] = useState("");
  const [activeState, setActiveState] = useState(false);
  const [menuVisible, setMenuVisible] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  const { user, selectedUser } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  const emojiBoxRef = useRef(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(newFiles);
    setMenuVisible(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      return;
    }
    try {
      setActiveState(true);
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      formData.append("caption", caption);
      formData.append("senderName", user.username);
      formData.append("senderId", user.id);
      formData.append("receiverName", selectedUser.username);
      formData.append("receiverId", selectedUser._id);
      formData.append("status", "delivered");

      await dispatch(sendImageData(formData));
      setFiles([]); // Clear the file input
      setCaption(""); // Clear the caption input
      setAttachFile(false); // Close the attachment modal
      await dispatch(
        getMessages({ senderId: user.id, receiverId: selectedUser?._id })
      );
      await dispatch(getLastMessage(user?.id));
    } catch (error) {
      console.error(error);
    } finally {
      setActiveState(false);
    }
  };

  const handleMenuClick = (type) => {
    let accept;
    switch (type) {
      case "photos":
        accept = "image/*";
        break;
      case "videos":
        accept = "video/*";
        break;
      case "camera":
        accept = "image/*;capture=camera";
        break;
      case "document":
        accept = "application/*";
        break;
      default:
        accept = "*/*";
    }
    fileInputRef.current.accept = accept;
    fileInputRef.current.click();
  };

  const emojiSend = (e) => {
    setCaption((emoji) => emoji + e);
  };

  return (
    <section className="w-[100vw] sm:w-[50vw] md:w-[50vw] lg:w-[40vw] h-[60vh] shadow-lg flex flex-col justify-between p-0 backdrop-blur-lg bg-white/70 dark:bg-black/70 border-b border-slate-100 rounded-lg z-20">
      {menuVisible ? (
        <div className="relative flex flex-col items-center justify-center h-full p-4">
          <button
            onClick={() => setAttachFile(false)}
            className="text-gray-800 font-bold p-2 dark:text-white top-1 left-1 text-3xl"
          >
            <MdClose />
          </button>
          <h2 className="mb-4 text-xl font-bold">Select an option</h2>
          <div className="w-full flex flex-col items-center space-y-4">
            <button
              onClick={() => handleMenuClick("photos")}
              className="flex items-start justify-start space-x-2 py-2 px-4 backdrop-blur-md bg-white/70 dark:bg-black/70 dark:text-white text-gray-800 duration-300 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-300 transition w-2/5"
            >
              <IoMdPhotos size={20} />
              <span>Photos</span>
            </button>
            <button
              onClick={() => handleMenuClick("videos")}
              className="flex items-start justify-start space-x-2 py-2 px-4 backdrop-blur-md bg-white/70 dark:bg-black/70 dark:text-white text-gray-800 duration-300 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-300 transition w-2/5"
            >
              <BiSolidVideos size={20} />
              <span>Videos</span>
            </button>
            <button
              onClick={() => handleMenuClick("camera")}
              className="flex items-start justify-start space-x-2 py-2 px-4 backdrop-blur-md bg-white/70 dark:bg-black/70 dark:text-white text-gray-800 duration-300 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-300 transition w-2/5"
            >
              <FaCamera size={20} />
              <span>Camera</span>
            </button>
            <button
              onClick={() => handleMenuClick("document")}
              className="flex items-start justify-start space-x-2 py-2 px-4 backdrop-blur-md bg-white/70 dark:bg-black/70 dark:text-white text-gray-800 duration-300 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-300 transition w-2/5"
            >
              <IoIosDocument size={20} />
              <span>Document</span>
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center h-full p-4">
          <div className="fixed top-0 left-0 right-0 h-8 flex justify-start items-center w-full backdrop-blur-lg bg-white/70 dark:bg-black/70 text-3xl dark:text-white text-gray-900 p-1 transition duration-200 z-50">
            <button onClick={() => setAttachFile(false)} className="px-1">
              <MdClose />
            </button>
          </div>
          <div className="h-full w-full relative">
            <div className="flex justify-center items-center">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview 0`}
                  className="md:w-[50vw] lg:w-[40vw] h-[42vh] object-cover z-10"
                />
              ) : (
                files.length > 0 && (
                  <>
                    {files[0].type === "application/pdf" ? (
                      <embed
                        key={0}
                        src={
                          URL.createObjectURL(files[0]) +
                          "#page=1&toolbar=0&navpanes=0&scrollbar=0"
                        }
                        type="application/pdf"
                        width="100%"
                        height="100%"
                        className="md:w-[50vw] lg:w-[40vw] h-[42vh] object-cover z-10"
                      />
                    ) : (
                      <img
                        key={0}
                        src={URL.createObjectURL(files[0])}
                        alt={`Preview 0`}
                        className="md:w-[50vw] lg:w-[40vw] h-[42vh] object-cover z-10"
                      />
                    )}
                  </>
                )
              )}

              <div className="absolute left-0 bottom-0 right-0 h-24 flex overflow-x-auto items-center py-2 px-4">
                {files.map((file, index) => {
                  return file.type === "application/pdf" ? (
                    <embed
                      key={0}
                      src={
                        URL.createObjectURL(files[0]) +
                        "#page=1&toolbar=0&navpanes=0&scrollbar=0"
                      }
                      type="application/pdf"
                      width="100%"
                      height="100%"
                      className="h-16 w-16 cursor-pointer object-cover overflow-hidden  rounded-md mr-2 z-0"
                    />
                  ) : (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      onClick={() => setImage(file)}
                      alt={`Preview ${index + 1}`}
                      className="h-16 w-16 cursor-pointer object-cover rounded-md mr-2 z-0"
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="fixed left-0 bottom-0 right-0 h-12 flex justify-center items-center p-2 rounded-lg shadow-md overflow-hidden bg-black">
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className="text-yellow-600 hover:text-yellow-500 transition duration-200"
            >
              <MdInsertEmoticon className="text-2xl sm:text-3xl" />
            </button>
            <input
              type="text"
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="flex-1 mx-2 p-1 px-1 sm:px-2 text-black bg-gray-100 rounded-lg focus:outline-none border border-gray-300 focus:border focus:border-gray-800 transition duration-200 placeholder:text-gray-600"
            />
            <button
              onClick={handleSend}
              className={`ml-0 sm:ml-2 p-1 px-2 sm:px-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 ${
                activeState ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={activeState}
            >
              <IoMdSend size={24} />
            </button>
          </div>
          <div>
            {showEmojis && (
              <div
                ref={emojiBoxRef}
                className="absolute left-0 sm:left-[-50%] bottom-12 border border-gray-300 dark:border-black rounded-tr-lg flex flex-wrap"
              >
                <EmojiBox emojiSend={emojiSend} />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ImgSendComponent;

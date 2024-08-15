import React, { useState } from "react";
import { IoIosShareAlt } from "react-icons/io";
import { BsReplyFill } from "react-icons/bs";
import { IoInformationCircle } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { IoIosCopy } from "react-icons/io";
import { RiSave2Fill, RiCloseFill } from "react-icons/ri";

const ContextMenuCurrentUser = ({
  handleDeleteForMe,
  handleDeleteForEveryone,
  setShowDeleteModal,
  showDeleteModal,
  handleCloseModal,
}) => {
  return (
    <>
      <div className="menu  min-w-[130px] lg:min-w-[150px] select-none backdrop-blur-xl bg-white/70 dark:bg-black/80  shadow-lg rounded-md py-1 absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-16 z-10 ">
        <button className="flex justify-start items-center gap-2 lg:gap-3 px-2 lg:px-4 py-2 chat-text w-full text-xs lg:text-md border-b border-slate-400 dark:border-slate-700 text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-900">
          <BsReplyFill className="text-md lg:text-lg" /> <span>Reply</span>
        </button>

        <button
          onClick={() => setShowDeleteModal(!showDeleteModal)}
          className="flex justify-start items-center gap-2 lg:gap-3 px-2 lg:px-4 py-2 chat-text w-full text-xs lg:text-md border-b border-slate-400 dark:border-slate-700 text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-900"
        >
          <MdDelete className="text-md lg:text-lg" /> <span>Delete</span>
        </button>

        <button
          onClick={() => setState(!state)}
          className="flex justify-start items-center gap-2 lg:gap-3 px-2 lg:px-4 py-2 chat-text w-full text-xs lg:text-md border-b border-slate-400 dark:border-slate-700 text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-900"
        >
          <IoIosShareAlt className="text-md lg:text-lg" /> <span>Forward</span>
        </button>
        <button className="flex justify-start items-center gap-2 lg:gap-3 px-2 lg:px-4 py-2 chat-text w-full text-xs lg:text-md border-b border-slate-400 dark:border-slate-700 text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-900">
          <IoIosCopy className="text-md lg:text-lg" /> <span>Copy Link</span>
        </button>
        <button className="flex justify-start items-center gap-2 lg:gap-3 px-2 lg:px-4 py-2 chat-text w-full text-xs lg:text-md border-b border-slate-400 dark:border-slate-700 text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-900">
          <RiSave2Fill className="text-md lg:text-lg" /> <span>Save as</span>
        </button>
        <button className="flex justify-start items-center gap-2 lg:gap-3 px-2 lg:px-4 py-2 chat-text w-full text-xs lg:text-md dark:border-slate-700 text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-900">
          <IoInformationCircle className="text-md lg:text-lg" />{" "}
          <span>Info</span>
        </button>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50 select-none">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 max-w-md ">
            <div className="mb-4 text-center">
              <h2 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">
                Delete Messages?
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                You can delete messages for everyone or just for yourself.
              </p>
            </div>
            <div className=" flex py-2  items-center justify-center gap-3 text-xs sm:text-sm">
              <button
                onClick={handleDeleteForMe}
                className="py-1 sm:py-2 px-2 sm:px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Delete for me
              </button>

              <button
                onClick={handleDeleteForEveryone}
                type="button"
                class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-md lg:text-sm text-xs  py-1 sm:py-2 px-2 sm:px-4 text-center "
              >
                {" "}
                Delete for everyone
              </button>

              <button
                onClick={handleCloseModal}
                className="py-1 sm:py-2 px-2 sm:px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContextMenuCurrentUser;

import React from "react";
import {
  FaUser,
  FaImage,
  FaFileAlt,
  FaLink,
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaInfoCircle,
  FaBan,
} from "react-icons/fa";

const UserProfile = ({ selectedUser }) => {
  const { username, image, email, phone, about } = selectedUser && selectedUser;
  return (
    <div className=" flex justify-center items-center shadow-md select-none z-50 chat-text">
      <div className="w-[100vw] sm:w-[500px] lg:w-[600px]  rounded-br-md overflow-hidden">
        <div className="flex h-full ">
          {/* Left Sidebar */}
          <div className="w-1/3 backdrop-blur-xl bg-gray-200 dark:bg-black p-6 ">
            <h2 className="text-xl font-semibold mb-6">Menu</h2>
            <ul className="space-y-4 my-5 text-black dark:text-slate-50 duration-200">
              <li className="flex items-center text-sm lg:text-md space-x-2 cursor-pointer font-normal hover:text-gray-600 dark:hover:text-gray-300">
                <FaUser />
                <span>Overview</span>
              </li>
              <li className="flex items-center text-sm lg:text-md space-x-2 cursor-pointer font-normal hover:text-gray-600 dark:hover:text-gray-300">
                <FaImage />
                <span>Media</span>
              </li>
              <li className="flex items-center text-sm lg:text-md space-x-2 cursor-pointer font-normal hover:text-gray-600 dark:hover:text-gray-300">
                <FaFileAlt />
                <span>Files</span>
              </li>
              <li className="flex items-center text-sm lg:text-md space-x-2 cursor-pointer font-normal hover:text-gray-600 dark:hover:text-gray-300">
                <FaLink />
                <span>Links</span>
              </li>
              <li className="flex items-center text-sm lg:text-md space-x-2 cursor-pointer font-normal hover:text-gray-600 dark:hover:text-gray-300">
                <FaUsers />
                <span>Groups</span>
              </li>
            </ul>
          </div>

          {/* Right Content */}
          <div className="w-2/3 px-4 py-3 relative bg-gradient-to-t from-slate-100 via-slate-200  to-slate-100 dark:bg-gradient-to-l dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
            <div className="flex flex-col items-center space-y-2">
              <img
                src={image}
                alt="User"
                className="w-20 lg:w-28 h-20 lg:h-28 rounded-full mb-0 border-2 border-gray-300"
              />
              <h3 className="text-2xl font-semibold ">{username}</h3>
              <p className="">{email}</p>
              <p className="">{phone}</p>
              <p className=" text-base   overflow-y-auto custom-scrollbar">
                {about}
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-4 ">
                <button className="text-red-600 hover:text-red-800 flex items-center absolute bottom-2  space-x-1 my-3">
                  <FaBan size={20} />
                  <span className="">Block</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

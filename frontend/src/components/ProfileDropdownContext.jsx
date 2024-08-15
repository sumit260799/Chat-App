import React, { useState } from "react";

const ProfileDropdownContext = ({
  handleImageChange,
  handleViewChange,
  handleRemoveImage,
}) => {
  const handleInputChange = (e) => {
    document.getElementById("profileImageInput").click();
  };

  return (
    <div className="py-2  shadow-xl bg-gradient-to-t from-slate-100 via-slate-200  to-slate-100 dark:bg-gradient-to-l dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 rounded-lg  w-[120px] ">
      <ul className=" text-xs font-normal ">
        <li
          className="flex items-center justify-start px-3 py-1   cursor-pointer hover:text-blue-500 duration-300 border-b border-gray-600"
          onClick={handleRemoveImage}
        >
          <span>Remove Image</span>
        </li>
        <li
          onClick={handleViewChange}
          className="flex items-center justify-start px-3 py-1  cursor-pointer hover:text-blue-500 duration-300 border-b border-gray-600"
        >
          <span>View Image</span>
        </li>
        <li
          className="flex items-center justify-start px-3 py-1  cursor-pointer hover:text-blue-500 duration-300 "
          onClick={handleInputChange}
        >
          <span>Change Image</span>
          {/* Hidden file input for image selection */}
          <input
            type="file"
            className="hidden"
            id="profileImageInput"
            onChange={handleImageChange}
          />
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdownContext;

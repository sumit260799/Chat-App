import React, { useEffect, useRef, useState } from "react";
import { MdEdit, MdSave } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import ImageCrop from "./ImageCrop";
import ProfileDropdownContext from "./ProfileDropdownContext";
import Modal from "./Modal";
import axios from "axios";
import { updateProfile, updateProfileImage } from "../features/authSlice";
import { logoutUser } from "../features/authSlice";
import PreviewImage from "./PreviewImage";
import { useUserContext } from "../context/UserContext";

const Profile = ({ user }) => {
  const { viewImage, setViewImage } = useUserContext();
  const profileRef = useRef(null);
  const dummyAvatar =
    "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

  const { id, image: img, email, username, phone, about } = user;
  const dispatch = useDispatch();

  const initialProfile = {
    name: username,
    phone: phone,
    about: about,
    email,
  };

  const [file, setFile] = useState([]);
  const [profile, setProfile] = useState(initialProfile);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState(false);

  const [isEditing, setIsEditing] = useState({
    name: false,
    phone: false,
    about: false,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setActiveMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  const handleEditToggle = (field) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  const handleViewChange = () => {
    setViewImage(!viewImage);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setIsModalVisible(true);
  };

  const handleRemoveImage = async () => {
    try {
      // Fetch the image from the dummyAvatar URL and convert it to a blob
      const response = await fetch(dummyAvatar);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("id", id);
      formData.append("image", blob, "dummyAvatar.png"); // Adding blob as file

      await dispatch(updateProfileImage(formData));
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  const handleCropComplete = async (croppedImageUrl) => {
    setCroppedImage(croppedImageUrl);
    setIsModalVisible(false);

    try {
      const blob = await fetch(croppedImageUrl).then((res) => res.blob());
      const formData = new FormData();
      formData.append("id", id);
      formData.append("image", blob, "croppedImage.png");
      await dispatch(updateProfileImage(formData));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleCloseModal = () => {
    setImage(null);
    setIsModalVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSave = async (field) => {
    try {
      const updatedProfile = {
        id,
        username: profile.name,
        phone: profile.phone,
        about: profile.about,
      };

      await dispatch(updateProfile(updatedProfile));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const closeImagePreview = () => {
    setViewImage(false);
  };

  const handleLogout = (id) => {
    // Implement logout functionality
    dispatch(logoutUser(id));
  };
  return (
    <div className=" relative min-w-[330px] w-full h-full  dark:border-gray-700 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 dark:bg-gradient-to-b dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 mt-4 p-6 text-gray-800 dark:text-white rounded-t-lg shadow-lg">
      {viewImage && (
        <PreviewImage
          previewImage={img}
          closeImagePreview={closeImagePreview}
        />
      )}

      <div
        ref={profileRef}
        className="absolute top-[-70px] left-[50%] translate-x-[-50%]     mt-2 z-30"
      >
        {activeMenu && (
          <ProfileDropdownContext
            img={img}
            handleImageChange={handleImageChange}
            handleViewChange={handleViewChange}
            handleRemoveImage={handleRemoveImage}
          />
        )}
      </div>
      <div className="flex flex-col items-center  select-none">
        {image && !croppedImage && (
          <Modal isVisible={isModalVisible} onClose={handleCloseModal}>
            <ImageCrop
              boxSize={200}
              imageSrc={image}
              onCropComplete={handleCropComplete}
              onClose={handleCloseModal}
            />
          </Modal>
        )}
        <div className="relative  mb-4 group">
          <img
            className="w-28 h-28 rounded-full object-fill"
            src={img}
            alt="User"
          />
          <label className="absolute inset-0 flex items-center justify-center">
            <MdEdit
              onClick={() => setActiveMenu(!activeMenu)}
              className="text-white text-2xl cursor-pointer"
            />
          </label>
        </div>

        <div className="w-full mb-1 flex items-center justify-between overflow-hidden border-b border-gray-300 dark:border-gray-700 pb-2">
          {isEditing.name ? (
            <div className="flex items-center w-full">
              <input
                className="border text-gray-900 border-gray-300 rounded px-3 py-1 w-full focus:outline-none focus:border-green-500 relative"
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
              <button
                onClick={() => handleSave("name")}
                className="ml-7 text-green-500"
              >
                <MdSave className="text-lg fixed right-6" />
              </button>
            </div>
          ) : (
            <div className="flex items-center w-full relative">
              <h2 className="text-md text-gray-800 dark:text-white font-medium break-words">
                {profile.name}
              </h2>
              <button
                onClick={() => handleEditToggle("name")}
                className="ml-3 text-blue-500 group-hover:opacity-100 flex justify-end"
              >
                <MdEdit className="text-lg fixed right-6" />
              </button>
            </div>
          )}
        </div>
        <div className="w-full mb-1 flex items-center justify-between overflow-hidden border-b border-gray-300 dark:border-gray-700 pb-2">
          <div className="flex items-center justify-start  relative">
            <p className="text-gray-800 dark:text-white break-words ">
              {profile.email}
            </p>
          </div>
        </div>
        <div className="w-full mb-1 flex items-center justify-between overflow-hidden border-b border-gray-300 dark:border-gray-700 pb-2">
          {isEditing.phone ? (
            <div className="flex items-center w-full">
              <input
                className="border border-gray-300 text-gray-900 rounded px-3 py-1 w-full focus:outline-none focus:border-green-500 relative"
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter your phone no.."
                maxLength={10}
              />
              <button
                onClick={() => handleSave("phone")}
                className="ml-3 text-green-500"
              >
                <MdSave className="text-lg " />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full relative">
              {profile.phone ? (
                <p className="text-gray-800 dark:text-white break-words pr-2">
                  {profile.phone}
                </p>
              ) : (
                "phone no"
              )}

              <button
                onClick={() => handleEditToggle("phone")}
                className=" text-blue-500 group-hover:opacity-100 "
              >
                <MdEdit className="text-lg fixed right-6" />
              </button>
            </div>
          )}
        </div>
        <div className="w-full mb-2 flex items-center justify-between break-words dark:border-gray-700 pb-2">
          {isEditing.about ? (
            <div className="flex items-center w-full">
              <textarea
                className="border border-gray-300 text-gray-900 rounded px-3 py-1 w-full focus:outline-none focus:border-green-500 relative"
                name="about"
                value={profile.about}
                onChange={handleChange}
                rows={2}
                placeholder="Enter about info..."
                maxLength={139}
              />

              <button
                onClick={() => handleSave("about")}
                className="ml-7 text-green-500"
              >
                <MdSave className="text-lg fixed right-6" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full relative">
              {profile.about ? (
                <p className=" text-gray-800 text-justify dark:text-white break-words  pr-2">
                  {profile.about}
                </p>
              ) : (
                "about info"
              )}

              <button
                onClick={() => handleEditToggle("about")}
                className=" text-blue-500 group-hover:opacity-100 "
              >
                <MdEdit className="text-lg fixed right-6" />
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => handleLogout(id)}
          type="button"
          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-1 text-center  mb-2"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Profile;

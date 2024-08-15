import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import ImageCrop from "../components/ImageCrop";
import Modal from "../components/Modal";
import { RxCross2 } from "react-icons/rx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSnackbar } from "notistack";

const Register = () => {
  // theme..........................................

  const [theme, setTheme] = useState(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDarkMode ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.add(theme);
    return () => {
      document.documentElement.classList.remove(theme);
    };
  }, [theme]);

  // ...................................................

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { authenticate, status, error } = useSelector((state) => state.auth);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (authenticate) {
      navigate("/");
    }
  }, [authenticate, navigate]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username" && value.length > 12) {
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setIsModalVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("confirmPassword", formData.confirmPassword);

    if (croppedImage) {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      data.append("image", blob, "croppedImage.png");
    }

    dispatch(registerUser(data))
      .unwrap()
      .catch((err) => {
        enqueueSnackbar(err?.errors[0], {
          variant: "error",
        });
      });
  };

  const handleCropComplete = (croppedImageUrl) => {
    setCroppedImage(croppedImageUrl);
    setIsModalVisible(false);
  };

  const handleCloseModal = () => {
    setImage(null);
    setIsModalVisible(false);
  };

  const handleRemoveImage = () => {
    setCroppedImage(null);
    setImage(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100  dark:bg-gray-800  text-black dark:text-white">
      <div className="w-full max-w-md p-6 space-y-6 bg-gradient-to-t from-slate-100 via-slate-200  to-slate-100 dark:bg-gradient-to-t dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg sm:shadow-md">
        <h2 className="text-3xl font-bold text-center ">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <label className="block text-sm font-medium ">Profile Image</label>
            <div className="relative w-28 h-28 mx-auto">
              {croppedImage ? (
                <div className="relative">
                  <img
                    src={croppedImage}
                    alt="Cropped Preview"
                    className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                    <button onClick={handleRemoveImage} className=" text-2xl">
                      <RxCross2 />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-800">
                  Profile Picture
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    required
                    className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium ">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full  text-black px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium ">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={40}
              required
              className="w-full  text-black px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium ">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full text-black  px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute inset-y-0 right-0 pr-3 flex justify-center h-full none items-center ${
                  formData.password.length < 1 && "hidden"
                }`}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium ">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full text-black  px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className={`absolute inset-y-0 right-0 pr-3 flex justify-center h-full items-center ${
                  formData.confirmPassword.length < 1 && "hidden"
                }`}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            {status === "loading" ? "Loading..." : "Register"}
          </button>
        </form>
        {image && !croppedImage && (
          <Modal isVisible={isModalVisible} onClose={handleCloseModal}>
            <ImageCrop
              boxSize={250}
              imageSrc={image}
              onCropComplete={handleCropComplete}
              onClose={handleCloseModal}
            />
          </Modal>
        )}
        {error &&
          error.errors &&
          error.errors.map((e, index) => (
            <p key={index} className="text-red-500">
              {e}
            </p>
          ))}
        <div className="text-center">
          <Link to="/messenger/login" className="text-blue-600 underline">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

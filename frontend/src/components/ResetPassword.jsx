import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword() {
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
  const [password, setPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const token = params.get("token");

  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:4000/api/messenger/reset-password/${id}/${token}`,
        { password }
      )
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/messenger/login");
          enqueueSnackbar("password updated successfully", {
            variant: "success",
          });
        }
      })
      .catch((err) => console.log(err));
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex justify-center items-center bg-slate-100  dark:bg-gray-800  text-black dark:text-white h-[100vh]">
      <div className="bg-gradient-to-t from-slate-100 via-slate-200  to-slate-100 dark:bg-gradient-to-t dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 p-6 rounded sm:shadow-md w-96">
        <h4 className="text-xl font-bold mb-4">Reset Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block font-bold mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                autoComplete="off"
                name="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-black focus:ring-blue-500"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute inset-y-0 right-0 pr-3 flex justify-center h-full none items-center ${
                  password.length < 1 && "hidden"
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
          <button
            type="submit"
            className="w-full bg-blue-500  py-2 rounded text-white focus:ring-blue-500 hover:bg-blue-600"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [viewImage, setViewImage] = useState(false);

  return (
    <UserContext.Provider value={{ viewImage, setViewImage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};

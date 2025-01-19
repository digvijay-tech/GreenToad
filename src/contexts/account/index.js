// User Account Context
"use client";

import { createContext, useState, useContext } from "react";
import { fetchUserAction } from "@/actions/user/index";

const AccountContext = createContext();

export function AccountProvider({ children }) {
  const [user, setUser] = useState(null);

  // storing received user object in context
  const getUser = async () => {
    if (!user) {
      console.log("API Called!");
      const response = await fetchUserAction();

      if (response) {
        setUser(response);
        // console.log(response);
      }
    }

    return user;
  };

  // remove user state when logout happens
  // to make sure when new user logs-in previous state is unpersisted
  const removeUser = () => {
    setUser(null);
  };

  return (
    <AccountContext.Provider value={{ user, getUser, removeUser }}>
      {children}
    </AccountContext.Provider>
  );
}

export const useAccountContext = () => {
  return useContext(AccountContext);
};

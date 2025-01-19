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
      }
    }

    return user;
  };

  return (
    <AccountContext.Provider value={{ user, getUser }}>
      {children}
    </AccountContext.Provider>
  );
}

export const useAccountContext = () => {
  return useContext(AccountContext);
};

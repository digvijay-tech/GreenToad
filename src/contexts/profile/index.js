// User Profile Context
"use client";

import { createContext, useState, useContext } from "react";
import { getAuthenticatedUserAction } from "@/actions/auth/index";

const UserProfileContext = createContext();

export function UserProfileProvider({ children }) {
  const [user, setUser] = useState(null); // stores auth.users from supabase
  const [profile, setProfile] = useState(null) //stores public.profiles from supabase

  // storing received user object in context
  const getUser = async () => {
    if (!user) {
      console.log("API Called `auth.users`!");
      const response = await getAuthenticatedUserAction();

      if (response) {
        setUser(response);
      }
    }

    return user;
  };

  // storing received user profile object in context
  const getProfile = async () => {
    if (!profile) {
      console.log("API Called `auth.users`!");

      // handle api call
    }

    return profile;
  }

  // remove user state when logout happens
  // to make sure when new user logs-in previous state is unpersisted
  const removeUser = () => {
    setUser(null);
    setProfile(null);
  };

  return (
    <UserProfileContext.Provider value={{ user, profile, getUser, getProfile, removeUser }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export const useUserProfileContext = () => {
  return useContext(UserProfileContext);
};

// User Profile Context
"use client";

import { createContext, useState, useContext } from "react";
import { getAuthenticatedUserAction } from "@/actions/auth/index";
import {
  getUserProfileAction,
  getUserWorkspacesAction,
} from "@/actions/profile/index";

const UserProfileContext = createContext();

export function UserProfileProvider({ children }) {
  const [user, setUser] = useState(null); // stores auth.users from supabase
  const [profile, setProfile] = useState(null); //stores public.profiles from supabase
  const [workspaces, setWorkspaces] = useState(null); // stores public.workspaces from supabase

  // storing received user object in context
  const getUser = async () => {
    if (!user) {
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
      // handle api call
      const response = await getUserProfileAction();

      if (response) {
        setProfile(response[0]);
      }
    }

    return profile;
  };

  // storing received user workspaces object in context
  const getWorkspaces = async () => {
    if (!workspaces) {
      // handles api call
      const response = await getUserWorkspacesAction();

      if (response) {
        setWorkspaces(response);
      }
    }

    return workspaces;
  };

  // remove user state when logout happens
  // to make sure when new user logs-in previous state is unpersisted
  const removeUserProfileContext = () => {
    setUser(null);
    setProfile(null);
    setWorkspaces(null);
  };

  return (
    <UserProfileContext.Provider
      value={{
        user,
        profile,
        workspaces,
        getUser,
        getProfile,
        getWorkspaces,
        removeUserProfileContext,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

// creates context hook
export const useUserProfileContext = () => {
  return useContext(UserProfileContext);
};

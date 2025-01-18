// User Account Context 
"use client";

import { createContext, useState, useContext } from "react";

const AccountContext = createContext();

export function AccountProvider({ children }) {
    const [account, setAccount] = useState({ user: null, theme: "light" });

    // fetch user profile details and store in the context
    const getUser = () => {
        setAccount({
            user: {
                name: "Haru",
                email: "haru@bhaa.com",
                pictureUrl: "/greentoad.png"
            },
            theme: "pink"
        });
    }

    return (
        <AccountContext.Provider value={{ account, getUser }}>
            { children }
        </AccountContext.Provider>
    );
}

export const useAccountContext = () => {
    return useContext(AccountContext);
}

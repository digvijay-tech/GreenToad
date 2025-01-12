// Login Page
"use client";

import { useState } from "react";
import { signInAction } from "@/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  return <TempLogin />;
}

function TempLogin() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleLogin = async (e) => {
    // prevents default form behaviour
    e.preventDefault();

    const fd = new FormData();
    fd.append("email", email);
    fd.append("password", password);

    await signInAction(fd);
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <Input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      </div>
      <div>
        <Input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      <div>
        <Button type="submit">Login</Button>
      </div>
    </form>
  );
}

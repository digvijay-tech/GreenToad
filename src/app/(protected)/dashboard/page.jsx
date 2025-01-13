"use client";

import { temp, temp2 } from "./test";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);
  const [fruites, setFruites] = useState(null);

  useEffect(() => {
    (async function () {
      const user = await temp();

      if (!user) {
        setEmail(null);
        setError("Unable to fetch user email!");
        return;
      }

      setEmail(user.email);
      setError(null);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      const resp = await temp2();

      setFruites(resp);
    })();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {email && <p>{email}</p>}
      {error && <p>{error}</p>}

      {!fruites && <p>No Fruites Yet!</p>}

      <ul className="mt-4">
        {fruites && fruites.map((f, i) => <li key={i}>{f.Name}</li>)}
      </ul>
    </div>
  );
}

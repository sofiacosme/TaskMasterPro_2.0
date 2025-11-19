import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { listenAuth } from "../firebase";

const Ctx = createContext<{ user: User | null; ready: boolean }>({ user: null, ready: false });
export const useAuth = () => useContext(Ctx);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => listenAuth(u => { setUser(u); setReady(true); }), []);
  return <Ctx.Provider value={{ user, ready }}>{children}</Ctx.Provider>;
};




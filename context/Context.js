import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import axios from "axios";
export const Ctx = createContext({});

export default function Context(props) {
  const router = useRouter();
  const [ctxData, setCtxData] = useState({
    loggedUserData: null,
    isAdmin: false,
    isLogged: false,
  });

  let allowed = true;

  useEffect(() => {
    if (router.pathname.startsWith("/admin") && !ctxData.isAdmin) {
      allowed = false;
    } else if (!ctxData.isLogged) allowed = false;
  }, []);

  useEffect(() => {
    if (!allowed) router.push("/");
  }, [allowed]);

  useEffect(() => {
    getUserData();
  }, []);

  function getUserData() {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      axios
        .get("/api/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          ctxData.loggedUserData = res.data;
          changeCtxData();
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }
  }

  console.log(ctxData, "ctxData");

  useEffect(() => {
    if (ctxData.loggedUserData !== null) {
      if (ctxData.loggedUserData.roles[0] === "admin") ctxData.isAdmin = true;
      else ctxData.isAdmin = false;
      ctxData.isLogged = true;
    } else {
      ctxData.loggedUserData = null;
      ctxData.isAdmin = false;
      ctxData.isLogged = false;
    }
    changeCtxData();
  }, [ctxData.loggedUserData]);

  function changeCtxData() {
    setCtxData({ ...ctxData });
  }

  return (
    <Ctx.Provider value={{ ctxData, changeCtxData, getUserData }}>
      <Navbar>{allowed && props.children}</Navbar>
    </Ctx.Provider>
  );
}

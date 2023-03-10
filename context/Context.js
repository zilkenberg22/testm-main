import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import { showMessage } from "../components/message";
import { showLoader } from "../components/Loader";
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
    const accessToken = Cookies.get("accessToken");
    if (accessToken === undefined && ctxData.isLogged) {
      clearAll();
    }
  }, [router]);

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
    const accessToken = Cookies.get("accessToken");

    if (accessToken !== undefined) {
      showLoader(true);
      axios
        .get("/api/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          ctxData.loggedUserData = res.data;
          changeCtxData();
          showLoader(false);
        })
        .catch((err) => {
          showMessage({
            show: true,
            message: err.response.data.message,
            type: "warning",
          });
          showLoader(false);
          clearAll();
        });
    }
  }

  function clearAll() {
    showMessage({
      show: true,
      message: "Таны хандалтын эрх дууссан тул нэвтэрнэ үү ",
      type: "warning",
    });
    showLoader(false);
    if (ctxData.isLogged) router.push("/login");
    else router.push("/");
    ctxData.loggedUserData = null;
    ctxData.isAdmin = false;
    ctxData.isLogged = false;
    changeCtxData();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  }

  useEffect(() => {
    if (ctxData.loggedUserData !== null) {
      if (ctxData.loggedUserData.roles === "admin") ctxData.isAdmin = true;
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
    <Ctx.Provider value={{ ctxData, changeCtxData, getUserData, clearAll }}>
      <Navbar>{allowed && props.children}</Navbar>
    </Ctx.Provider>
  );
}

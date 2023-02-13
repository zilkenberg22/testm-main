import React, { useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { showMessage } from "./message";
import { Ctx } from "../context/Context";
import Link from "next/link";

export default function Navbar({ children }) {
  const router = useRouter();
  const ctx = useContext(Ctx);
  const { ctxData, changeCtxData } = ctx;

  async function logout() {
    let option = {
      headers: {
        "Cache-Control": "no-cache",
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          ctxData.isLogged ? ctxData.loggedUserData.accessToken : ""
        }`,
      },
      timeout: 30000,
    };

    axios
      .post(
        "/api/logout",
        JSON.stringify(ctxData.loggedUserData.refreshToken),
        option
      )
      .then((response) => {
        ctxData.loggedUserData = null;
        ctxData.isAdmin = false;
        ctxData.isLogged = false;
        changeCtxData();
        showMessage({
          show: true,
          message: response.data.message,
          type: "success",
        });
        router.push("/");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          showMessage({
            show: true,
            message: error.response.data.message,
            type: "warning",
          });
        }
      });
  }

  return (
    <>
      <nav className="flex items-center justify-between flex-wrap bg-indigo-500 p-4">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <Link href="/">
            <p className="font-medium text-xl">Next JS Security Practices</p>
          </Link>
        </div>
        <div
          className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto `}
        >
          <div className="text-sm lg:flex-grow">
            <Link href="/">
              <p className="block mt-4 text-xl lg:inline-block lg:mt-0 text-indigo-200 hover:text-white mr-4">
                Home
              </p>
            </Link>
            {ctxData.isAdmin && ctxData.isLogged && (
              <Link href="/admin/dashboard">
                <p className="block mt-4 text-xl lg:inline-block lg:mt-0 text-indigo-200 hover:text-white mr-4">
                  Dashboard
                </p>
              </Link>
            )}
            {ctxData.isLogged && (
              <Link href="/profile">
                <p className="block mt-4 text-xl lg:inline-block lg:mt-0 text-indigo-200 hover:text-white mr-4">
                  Profile
                </p>
              </Link>
            )}
          </div>
          <div>
            {!ctxData.isLogged && (
              <>
                <Link href="/login">
                  <p className="inline-block text-sm px-4 py-2 mr-4 leading-none border rounded text-white border-white hover:border-transparent hover:text-indigo-500 hover:bg-white lg:mt-0">
                    Login
                  </p>
                </Link>
                <Link href="/signup">
                  <p className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-indigo-500 hover:bg-white">
                    Register
                  </p>
                </Link>
              </>
            )}
            {ctxData.isLogged && (
              <Link href="#" onClick={() => logout()}>
                <p className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-indigo-500 hover:bg-white lg:mt-0">
                  Logout
                </p>
              </Link>
            )}
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}

import React, { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { showMessage } from "./message";
import { Ctx } from "../context/Context";

export default function Navbar({ children }) {
  const router = useRouter();
  const ctx = useContext(Ctx);
  const { ctxData, changeCtxData } = ctx;

  async function logout() {
    const refreshToken = Cookies.get("refreshToken");
    const accessToken = Cookies.get("accessToken");

    if (accessToken !== undefined) {
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .post("/api/logout", refreshToken, option)
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
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
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
    } else ctx.clearAll();
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
                Нүүр хуудас
              </p>
            </Link>
            {ctxData.isAdmin && ctxData.isLogged && (
              <Link href="/admin/dashboard">
                <p className="block mt-4 text-xl lg:inline-block lg:mt-0 text-indigo-200 hover:text-white mr-4">
                  Хяналтын самбар
                </p>
              </Link>
            )}
            {ctxData.isLogged && (
              <Link href="/profile">
                <p className="block mt-4 text-xl lg:inline-block lg:mt-0 text-indigo-200 hover:text-white mr-4">
                  Хувийн мэдээлэл
                </p>
              </Link>
            )}
          </div>
          <div>
            {!ctxData.isLogged && (
              <>
                <Link href="/login">
                  <p className="inline-block text-sm px-4 py-2 mr-4 leading-none border rounded text-white border-white hover:border-transparent hover:text-indigo-500 hover:bg-white lg:mt-0">
                    Нэвтрэх
                  </p>
                </Link>
                <Link href="/signup">
                  <p className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-indigo-500 hover:bg-white">
                    Бүртгүүлэх
                  </p>
                </Link>
              </>
            )}
            {ctxData.isLogged && (
              <Link href="#" onClick={() => logout()}>
                <p className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-indigo-500 hover:bg-white lg:mt-0">
                  Гарах
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

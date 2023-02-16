import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { loginValidate } from "../tools/validate";
import { showMessage } from "../components/message";
import { Ctx } from "../context/Context";
import { csrfMiddleware } from "../tools/csrf";

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  let csrfToken;
  csrfMiddleware(req, res, () => {
    csrfToken = res.req.csrfToken;
  });
  return { props: { csrfToken } };
};

export default function Login(props) {
  const router = useRouter();
  const ctx = useContext(Ctx);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const err = loginValidate(form);
    if (err?.error) {
      showMessage({ show: true, message: err.message, type: "warning" });
      return;
    }

    let option = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .post("/api/login", JSON.stringify(form), option)
      .then((response) => {
        var accessTokenTime = new Date();
        accessTokenTime.setTime(accessTokenTime.getTime() + 15 * 60 * 1000);
        Cookies.set("accessToken", response.data.accessToken, {
          expires: accessTokenTime,
          secure: true,
          HttpOnly: true,
        });
        Cookies.set("refreshToken", response.data.refreshToken, {
          expires: 1,
          secure: true,
          HttpOnly: true,
        });
        ctx.getUserData();
        setForm({ userName: "", email: "", password: "" });

        showMessage({
          show: true,
          message: response.data.message,
          type: "success",
        });

        router.push("/");
      })
      .catch((error) => {
        if (error) {
          showMessage({
            show: true,
            message: error.response.data.message,
            type: "warning",
          });
        }
      });
  }

  return (
    <div className="flex items-center justify-center mt-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <input type="hidden" name="_csrf" value={props.csrfToken} />
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="email"
          >
            И-Майл хаяг
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="password"
          >
            Нууц үг
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Нэвтрэх
          </button>
        </div>
      </form>
    </div>
  );
}

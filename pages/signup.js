import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { signupValidate } from "../tools/validate";
import { showMessage } from "../components/message";
import { csrfMiddleware } from "../tools/csrf";

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  let csrfToken;
  csrfMiddleware(req, res, () => {
    csrfToken = res.req.csrfToken;
  });
  return { props: { csrfToken } };
};

export default function Signup(props) {
  const router = useRouter();
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    try {
      const err = signupValidate(form);
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
        .post("/api/signup", JSON.stringify(form), option)
        .then((response) => {
          showMessage({
            show: true,
            message: response.data.message,
            type: "success",
          });
          setForm({ userName: "", email: "", password: "" });
          router.push("/login");
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
    } catch (error) {
      showMessage({ show: true, message: error, type: "warning" });
    }
  }

  return (
    <div className="flex items-center justify-center mt-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <input type="hidden" name="csrf_token" value={props.csrfToken} />
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="username"
          >
            Хэрэглэгчийн нэр
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            maxLength="50"
            required
          />
        </div>
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
            minLength="8"
            required
          />
        </div>
        <div className="flex w-full">
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Бүртгүүлэх
          </button>
        </div>
      </form>
    </div>
  );
}

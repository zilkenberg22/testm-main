import React, { useContext, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { showMessage } from "../components/message";
import { Ctx } from "../context/Context";
import { updateValidate } from "../tools/validate";
import { csrfMiddleware } from "../tools/csrf";
import { showLoader } from "../components/Loader";

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  let csrfToken;
  csrfMiddleware(req, res, () => {
    csrfToken = res.req.csrfToken;
  });
  return { props: { csrfToken } };
};

export default function Profile(props) {
  const ctx = useContext(Ctx);
  const { ctxData } = ctx;
  const [showEdit, setShowEdit] = useState(false);
  const [newData, setNewData] = useState({});

  function editProfile() {
    setShowEdit(true);
    setNewData(ctxData.loggedUserData);
  }

  function handleChange(e) {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  }

  function updateData() {
    showLoader(true);
    const accessToken = Cookies.get("accessToken");

    const err = updateValidate(newData);
    if (err?.error) {
      showMessage({ show: true, message: err.message, type: "warning" });
      showLoader(false);
      return;
    }

    if (accessToken !== undefined) {
      let option = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      axios
        .post("/api/editUser", newData, option)
        .then((response) => {
          ctx.getUserData();
          showMessage({
            show: true,
            message: response.data.message,
            type: "success",
          });
          setShowEdit(false);
          setNewData({});
          showLoader(false);
        })
        .catch((error) => {
          showLoader(false);
          if (error.response.status === 403) {
            ctx.clearAll(error);
          } else {
            showMessage({
              show: true,
              message: error.response.data.message,
              type: "warning",
            });
          }
        });
    } else ctx.clearAll();
  }

  function back() {
    setShowEdit(false);
    setNewData({});
  }

  return (
    <div className="flex items-center w-full justify-center mt-8">
      {!showEdit ? (
        <div className="w-1/4">
          <div className="bg-white shadow-xl rounded-lg py-3">
            <div className="photo-wrapper p-2">
              <svg
                className="w-32 h-32 rounded-full mx-auto text-gray-900"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="M16 8a5 5 0 1 0 5 5a5 5 0 0 0-5-5Z"
                />
                <path
                  fill="currentColor"
                  d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2Zm7.992 22.926A5.002 5.002 0 0 0 19 20h-6a5.002 5.002 0 0 0-4.992 4.926a12 12 0 1 1 15.985 0Z"
                />
              </svg>
            </div>
            <div className="p-2">
              <h3 className="text-center text-xl text-gray-900 font-medium leading-8">
                {ctxData.loggedUserData?.userName}
              </h3>
              <div className="text-center text-gray-400 text-xs font-semibold">
                <p>{ctxData.loggedUserData?.roles}</p>
              </div>
              <table className="text-xs my-3">
                <tbody>
                  <tr>
                    <td className="px-2 py-2 text-gray-500 font-semibold">
                      Хаяг
                    </td>
                    <td className="px-2 py-2 text-gray-500">
                      {ctxData.loggedUserData?.address}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 text-gray-500 font-semibold">
                      Утас
                    </td>
                    <td className="px-2 py-2 text-gray-500">
                      {ctxData.loggedUserData?.phoneNumber}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 text-gray-500 font-semibold">
                      И-Майл
                    </td>
                    <td className="px-2 py-2 text-gray-500">
                      {ctxData.loggedUserData?.email}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-center my-3">
                <button
                  className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
                  onClick={() => editProfile()}
                >
                  Мэдээллээ засах
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <input type="hidden" name="_csrf" value={props.csrfToken} />
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
                value={newData?.userName}
                onChange={handleChange}
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
                value={newData?.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="address"
              >
                Хаяг
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="address"
                type="text"
                name="address"
                value={newData?.address}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="phoneNumber"
              >
                Утасны дугаар
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="phoneNumber"
                type="number"
                name="phoneNumber"
                value={newData?.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => updateData()}
              >
                Шинэчлэх
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => back()}
              >
                Буцах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { showMessage } from "../../components/message";
import { Ctx } from "../../context/Context";
import { showLoader } from "../../components/Loader";

export default function Dashboard() {
  const ctx = useContext(Ctx);
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newRole, setNewRole] = useState(null);

  useEffect(() => {
    getAllUser();
  }, []);

  function getAllUser() {
    const accessToken = Cookies.get("accessToken");
    if (accessToken !== undefined) {
      showLoader(true);
      axios
        .get("/api/admin/getAll", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setUsers([...response.data.users]);
          showLoader(false);
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            showMessage({
              show: true,
              message: error.response.data.message,
              type: "warning",
            });
          }
          showLoader(false);
        });
    } else ctx.clearAll();
  }

  function editUser(user, index) {
    setEditIndex(index);
    setNewRole(user.roles);
  }

  function updateUser(user) {
    let newUser = user;
    newUser.roles = newRole;
    const accessToken = Cookies.get("accessToken");
    if (accessToken !== undefined) {
      showLoader(true);
      let option = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      axios
        .post("/api/admin/editUser", newUser, option)
        .then((response) => {
          setEditIndex(null);
          setNewRole(null);
          showMessage({
            show: true,
            message: response.data.message,
            type: "success",
          });
          showLoader(false);
          getAllUser();
        })
        .catch((error) => {
          if (error) {
            showMessage({
              show: true,
              message: error.response.data.message,
              type: "warning",
            });
          }
          showLoader(false);
        });
    } else ctx.clearAll();
  }

  function deleteUser(user) {
    const accessToken = Cookies.get("accessToken");
    if (accessToken !== undefined) {
      let option = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      axios
        .post("/api/admin/deleteUser", user, option)
        .then((response) => {
          showMessage({
            show: true,
            message: response.data.message,
            type: "success",
          });
          getAllUser();
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
    } else ctx.clearAll();
  }

  return (
    <div className="w-full flex justify-center mt-8">
      <table className="border-collapse w-2/3">
        <thead className="bg-gray-800 text-white">
          <tr className="text-left">
            <th className="py-2 px-4">Хэрэглэгчийн нэр</th>
            <th className="py-2 px-4">И-Майл хаяг</th>
            <th className="py-2 px-4">Эрх</th>
            <th className="py-2 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((x, i) => (
            <tr key={i} className="text-left border-b border-gray-400">
              <td className="py-2 px-4">{x.userName}</td>
              <td className="py-2 px-4">{x.email}</td>
              {editIndex !== i ? (
                <td className="py-2 px-4">{x.roles}</td>
              ) : (
                <td className="py-2 px-4">
                  <select
                    name="roles"
                    id="roles"
                    className="text-gray-900"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="">-</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                  </select>
                </td>
              )}
              {editIndex !== null && editIndex === i ? (
                <td className="py-2 px-4">
                  <button
                    className="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-2 px-4 rounded-full inline-flex items-center"
                    onClick={() => updateUser(x, i)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      className="mr-2"
                    >
                      <path
                        fill="currentColor"
                        d="M21 7v12q0 .825-.587 1.413Q19.825 21 19 21H5q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h12Zm-9 11q1.25 0 2.125-.875T15 15q0-1.25-.875-2.125T12 12q-1.25 0-2.125.875T9 15q0 1.25.875 2.125T12 18Zm-6-8h9V6H6Z"
                      />
                    </svg>
                    Хадгалах
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center ml-2"
                    onClick={() => {
                      setEditIndex(null);
                      setNewRole(null);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      className="mr-2"
                    >
                      <path
                        fill="currentColor"
                        d="m10.875 19.3l-6.6-6.6q-.15-.15-.213-.325Q4 12.2 4 12t.062-.375q.063-.175.213-.325l6.6-6.6q.275-.275.687-.288q.413-.012.713.288q.3.275.313.687q.012.413-.288.713L7.4 11h11.175q.425 0 .713.287q.287.288.287.713t-.287.712Q19 13 18.575 13H7.4l4.9 4.9q.275.275.288.7q.012.425-.288.7q-.275.3-.7.3q-.425 0-.725-.3Z"
                      />
                    </svg>
                    Болих
                  </button>
                </td>
              ) : (
                <td className="py-2 px-4">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full inline-flex items-center"
                    onClick={() => editUser(x, i)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      className="mr-2"
                    >
                      <path
                        fill="currentColor"
                        d="m19.3 8.925l-4.25-4.2l1.4-1.4q.575-.575 1.413-.575q.837 0 1.412.575l1.4 1.4q.575.575.6 1.388q.025.812-.55 1.387ZM17.85 10.4L7.25 21H3v-4.25l10.6-10.6Z"
                      />
                    </svg>
                    Засах
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center ml-2"
                    onClick={() => deleteUser(x)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      className="mr-2"
                    >
                      <path
                        fill="currentColor"
                        d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21Zm2-4h2V8H9Zm4 0h2V8h-2Z"
                      />
                    </svg>
                    Устгах
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

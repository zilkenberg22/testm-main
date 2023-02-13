import axios from "axios";

export const login = async (email, password) => {
  try {
    const response = await axios.post("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const response = await axios.post("/api/auth/refresh-token", {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async (accessToken) => {
  try {
    const response = await axios.post(
      "/api/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (accessToken) => {
  try {
    const response = await axios.get("/api/auth/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setAccessToken = (accessToken) => {
  localStorage.setItem("accessToken", accessToken);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const setRefreshToken = (refreshToken) => {
  localStorage.setItem("refreshToken", refreshToken);
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const checkAccessToken = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken) {
    return false;
  }

  try {
    const response = axios.get("/api/auth/check-token", {
      headers: {
        Authorization: ` Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response.status === 401 && refreshToken) {
      refreshAccessToken(refreshToken);
    }
    return false;
  }
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await refreshToken(refreshToken);

    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);

    return response.accessToken;
  } catch (error) {
    return false;
  }
};

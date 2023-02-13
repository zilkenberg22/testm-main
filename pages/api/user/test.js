import React, { useState, useEffect } from "react";
import Router from "next/router";

import { checkAccessToken, getAccessToken, logout } from "./auth";

export const withAuth = (Component) => {
  const WrappedComponent = (props) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const checkToken = async () => {
        const accessToken = getAccessToken();

        if (!accessToken) {
          setLoading(false);
          return;
        }

        const isValid = await checkAccessToken();

        if (!isValid) {
          logout();
          setLoading(false);
          Router.push("/login");
          return;
        }

        setAuthenticated(true);
        setLoading(false);
      };

      checkToken();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!authenticated) {
      return null;
    }

    return <Component {...props} />;
  };

  WrappedComponent.getInitialProps = async (ctx) => {
    const componentProps =
      Component.getInitialProps && (await Component.getInitialProps(ctx));
    return { ...componentProps };
  };

  return WrappedComponent;
};

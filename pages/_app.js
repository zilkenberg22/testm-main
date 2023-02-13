import "../styles/globals.css";
import Context from "../context/Context";
import { Router } from "next/router";

function MyApp({ Component, pageProps }) {
    Router.events.on("routeChangeStart", (url) => {
        if (process.env.NODE_ENV === "production" && !url.startsWith("https://")) {
            window.location.replace(`https://${window.location.host}${url}`);
        }
    });

    return (
        <div className="min-h-screen">
            <Context>
                <div className="flex-1">
                    <Component {...pageProps} />
                </div>
                <div id="showMessage" />
            </Context>
        </div>
    );
}

export default MyApp;

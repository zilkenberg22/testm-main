import "../styles/globals.css";
import Context from "../context/Context";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen">
      <Context>
        <div className="flex-1">
          <Component {...pageProps} />
        </div>
        <div id="showMessage" />
        <div id="showLoader" />
      </Context>
    </div>
  );
}

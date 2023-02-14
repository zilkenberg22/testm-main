import "../styles/globals.css";
import Context from "../context/Context";

function MyApp({ Component, pageProps }) {
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

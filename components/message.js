import { createRoot } from "react-dom/client";

export function showMessage(value) {
  const element = value.show ? (
    <div
      className={`fixed bottom-5 right-3 p-4 rounded-lg shadow-lg text-white text-sm font-bold ${
        value.type === "success"
          ? "bg-green-500"
          : value.type === "warning"
          ? "bg-yellow-500"
          : "bg-red-500"
      }`}
    >
      {value.message}
    </div>
  ) : (
    ""
  );

  const container = document.getElementById("showMessage");
  const root = createRoot(container);
  root.render(element);

  setTimeout(() => {
    root.render(<div />);
  }, 3000);
}

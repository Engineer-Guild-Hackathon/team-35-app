import { createRoot } from "react-dom/client";
import App from "./src/App";
import "./src/index.css";
import "./src/style/globals.css";
import { applyThemeFromStorage } from "./src/lib/theme";

applyThemeFromStorage();
createRoot(document.getElementById("root")!).render(<App />);

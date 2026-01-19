import { createRoot } from "react-dom/client";
import App from "./app/App";

import "./styles/index.css";
import { LockKeyhole } from "lucide-react";

createRoot(document.getElementById("root")!).render(<App />);

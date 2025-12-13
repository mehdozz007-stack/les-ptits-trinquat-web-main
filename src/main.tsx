import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Gère la redirection depuis 404.html
if (sessionStorage.redirect) {
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  window.location.href = redirect;
}

createRoot(document.getElementById("root")!).render(<App />);

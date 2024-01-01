import React from "react";
import ReactDOM from "react-dom/client";

import { Loading } from "./Components/Homepage/Loading.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const App = React.lazy(() => import("./App.jsx"));

import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <React.Suspense fallback={<Loading />}>
              <App />
            </React.Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

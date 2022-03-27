import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";

import HomePage from "./pages";
import AnalyzePage from "./pages/analyze";
import reportWebVitals from "./reportWebVitals";
import NotFoundPage from "./pages/error/404";

SyntaxHighlighter.registerLanguage(
  "solidity",
  require("highlightjs-solidity").solidity
);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyze/:target" element={<AnalyzePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

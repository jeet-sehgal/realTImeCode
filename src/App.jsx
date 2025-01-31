import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Editor from "./components/Editor";
import { FormProvider } from "./context/homeForm";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/edit/:editId",
      element: <Editor />,
    },
  ]);

  return (
    <>
      <Toaster position="top-center"></Toaster>
      <RouterProvider router={route}></RouterProvider>
    </>
  );
}

export default App;

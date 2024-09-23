import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GroupRoute from "./components/showImages.tsx";
import UploadImages from "./components/uploadImages.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UploadImages />,
  },
  {
    path: "/:groupId",
    element: <GroupRoute />,
  },
]);

// take from URL href port from env files
export const serverUrl = `${window.location.protocol}//${window.location.hostname}:${import.meta.env.VITE_SERVER_PORT}`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>
);

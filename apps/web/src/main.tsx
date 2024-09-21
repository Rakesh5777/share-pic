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

export const serverUrl = process.env.SERVER_URL || "http://localhost:8080";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>
);

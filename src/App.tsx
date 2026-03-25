import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster richColors />
    </div>
  );
}

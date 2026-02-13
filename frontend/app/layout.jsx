// frontend/app/layout.jsx
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Azki Profile",
  description: "Azki Profile"
};

// frontend/app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}



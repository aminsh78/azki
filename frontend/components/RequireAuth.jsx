// frontend/components/RequireAuth.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    setChecking(false);
  }, [router]);

  return (
    <>
      <LoadingOverlay show={checking} text="در حال بررسی دسترسی..." />
      {!checking && children}
    </>
  );
}

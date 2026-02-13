"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // اگر ذخیره کردی
    router.replace("/signin");
  };

  return (
    <button
      onClick={onLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
    >
      خروج
    </button>
  );
}

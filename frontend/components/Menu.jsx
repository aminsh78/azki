// frontend/components/Menu.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default function Menu() {
  const pathname = usePathname();
  const isActive = (p) => pathname === p;

  return (
    <div dir="ltr" className="relative">
      {/* Logout fixed top-right (all pages) */}
      <div className="fixed top-6 right-6 z-50">
        <LogoutButton />
      </div>

      {/* MENU */}
      <div className="flex justify-center pt-8">
        <div className="bg-white shadow-md rounded-full px-12 py-3">
          <ul className="flex flex-row-reverse gap-6 text-gray-400 font-medium">
            <Link href={"/home"}>
              <li className={`hover:text-blue-main cursor-pointer ${isActive("/home") ? "text-blue-main font-bold" : ""}`}>
                خانه
              </li>
            </Link>

            <Link href={"/profile"}>
              <li className={`hover:text-blue-main cursor-pointer ${isActive("/profile") ? "text-blue-main font-bold" : ""}`}>
                پروفایل
              </li>
            </Link>

            <Link href={"/blog"}>
              <li className={`hover:text-blue-main cursor-pointer ${isActive("/blog") ? "text-blue-main font-bold" : ""}`}>
                بلاگ
              </li>
            </Link>

            <Link href={"/notification"}>
              <li className={`hover:text-blue-main cursor-pointer ${isActive("/notification") ? "text-blue-main font-bold" : ""}`}>
                اطلاع‌رسانی
              </li>
            </Link>

            <Link href={"/report"}>
              <li className={`hover:text-blue-main cursor-pointer ${isActive("/report") ? "text-blue-main font-bold" : ""}`}>
                گزارش‌ها
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}

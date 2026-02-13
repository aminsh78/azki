// frontend/app/blog/page.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import Menu from "@/components/Menu";
import LoadingOverlay from "@/components/LoadingOverlay";
import ScrollReveal from "@/components/ScrollReveal";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/formatDate";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get("/notifications?limit=3");
        setNews(res.data?.items || []);
      } catch {
        toast.error("خطا در دریافت اطلاع‌رسانی‌ها");
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <RequireAuth>
      <div className="relative min-h-screen">
        <LoadingOverlay show={loading} />

        <Image
          src="/photos/Group.png"
          alt="bg"
          fill
          className="object-cover -z-10"
        />

        <Menu />

        <ScrollReveal>
          <div className="max-w-6xl mx-auto mt-10  rounded-3xl shadow-lg overflow-hidden">
            <div className="relative h-[350px] md:h-[420px]">
              <Image
                src="/photos/Frame 35757.png"
                alt="yalda"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <div className="max-w-6xl mx-auto mt-10 bg-white rounded-3xl shadow-lg p-10 ">
            <h2 className="text-xl font-bold mb-6 flex items-center justify-end">
              به‌زودی، فراجی چت‌بات هوشمند ازکی!
            </h2>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="">
                <Image
                  src="/photos/ChatGPTBOT.png"
                  alt="bot"
                  width={220}
                  height={220}
                  className="mx-auto"
                />
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <p className="flex items-center justify-end">هر سوالی داری بپرس</p>
                <div className="bg-white rounded-xl p-3 shadow flex items-center justify-end">مدارک تمدید بیمه؟</div>
                <div className="bg-white rounded-xl p-3 shadow flex items-center justify-end">انتقال تخفیف چطور انجام می‌شود؟</div>
                <div className="bg-white rounded-xl p-3 shadow flex items-center justify-end">مدارک بیمه مسافرتی؟</div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-6xl mx-auto mt-12">
            <h2 className="text-xl font-bold mb-6 text-right">
              آخرین اطلاع‌رسانی‌ها
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow p-6 text-sm leading-relaxed text-right"
                >
                  {item.text}
                  <span className="block text-gray-400 mt-4 text-xs">
                    {formatDate(item.date)}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/notification">
              <button className="mt-6 bg-blue-main text-white px-6 py-2 rounded-xl">
                مشاهده بیشتر
              </button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </RequireAuth>
  );
}

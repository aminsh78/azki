// frontend/app/notification/page.jsx
"use client";

import SearchInput from '@/ui/SearchInput';
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import RequireAuth from "@/components/RequireAuth";
import Menu from "@/components/Menu";
import LoadingOverlay from "@/components/LoadingOverlay";
import ScrollReveal from "@/components/ScrollReveal";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/formatDate";

function Page() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  async function fetchItems(query) {
    setLoading(true);
    try {
      const res = await api.get(`/notifications?limit=50${query ? `&q=${encodeURIComponent(query)}` : ""}`);
      setItems(res.data?.items || []);
    } catch {
      toast.error("خطا در دریافت اطلاع‌رسانی‌ها");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems("");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchItems(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <RequireAuth>
      <div className="min-h-screen relative w-full h-screen">
        <LoadingOverlay show={loading} />

        <Image
          src="/Photos/Homepage_Hero.jpg"
          alt="bg"
          fill
          className="object-cover -z-10"
        />

        <Menu />

        <ScrollReveal>
          <div className='max-w-6xl mx-auto mt-10  bg-blur-box  rounded-[32px] shadow-xl p-4 flex items-center justify-center gap-x-8 px-6  flex-col'>
            <div className='w-full flex justify-between items-center'>
              <SearchInput value={q} onChange={(e)=>setQ(e.target.value)} placeholder="جستجو در اطلاع‌رسانی‌ها..." />
              <div className='font-bold text-xl'>اطلاع رسانی ها</div>
            </div>

            <div className='flex flex-col text-right'>
              <span className='font-bold mt-8 flex flex-col gap-2'>
                <span className=''>آخرین اطلاع رسانی شخص ثالث</span>
                <span className=''><img src="/Photos/ScreenshotSA.png" alt="" /></span>
                <div className='flex items-end'>
                  <Link href={"/notification/"}><button className="bg-blue-main text-white p-2 rounded-xl hover:bg-blue-600 transition-all mt-6">مشاهده بیشتر</button></Link>
                </div>
              </span>

              <span className='font-bold mt-8 flex flex-col gap-4'>
                <span className=''>آخرین اطلاع رسانی بدنه </span>
                <span className=''><img src="/Photos/ScreenshotBA.png" alt="" /></span>
                <div className='flex items-end'>
                  <Link href={"/notification/"}><button className="bg-blue-main text-white p-2 rounded-xl hover:bg-blue-600 transition-all mt-6">مشاهده بیشتر</button></Link>
                </div>
              </span>

              <span className='font-bold mt-8 flex flex-col gap-4'>
                <span className=''>آخرین اطلاع رسانی عمومی </span>
                <span className=''><img src="/Photos/ScreenshotOM .png" alt="" /></span>
                <div className='flex items-end'>
                  <Link href={"/notification/"}><button className="bg-blue-main text-white p-2 rounded-xl hover:bg-blue-600 transition-all mt-6">مشاهده بیشتر</button></Link>
                </div>
              </span>

              <span className='font-bold mt-8 flex flex-col gap-4'>
                <span className=''>آخرین اطلاع رسانی غیر خودرویی </span>
                <span className=''><img src="/Photos/ScreenshotGH.png" alt="" /></span>
                <div className='flex items-end'>
                  <Link href={"/notification/"}><button className="bg-blue-main text-white p-2 rounded-xl hover:bg-blue-600 transition-all mt-2">مشاهده بیشتر</button></Link>
                </div>
              </span>
            </div>

            <div className="w-full mt-8">
              <div className="flex justify-end font-bold text-lg mb-4">لیست اطلاع‌رسانی‌ها</div>
              <div className="grid md:grid-cols-2 gap-4">
                {items.map((it) => (
                  <div key={it.id} className="bg-white rounded-2xl shadow p-5 text-right">
                    <div className="font-bold mb-2">{it.title}</div>
                    <div className="text-sm text-gray-700 whitespace-pre-line">{it.text}</div>
                    <div className="text-xs text-gray-400 mt-3">{formatDate(it.date)}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </ScrollReveal>

      </div>
    </RequireAuth>
  )
}

export default Page;

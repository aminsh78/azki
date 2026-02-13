"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import LoadingOverlay from "@/components/LoadingOverlay";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

function toNumberOrDash(v) {
  if (v === null || v === undefined) return "-";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "-";
  const s = String(v).trim();
  if (!s) return "-";
  const cleaned = s.replace(/[%٬,]/g, "").replace(/,/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? String(n) : "-";
}

export default function Page() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    qa_total: "-",
    qc_total: "-",
    rank: "-",
    accepted_errors: "-",
  });


  const [qcItems, setQcItems] = useState([]);
  const [qcMsg, setQcMsg] = useState(null);

  const [errItems, setErrItems] = useState([]);
  const [errMsg, setErrMsg] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [homeRes, qcRes, errRes] = await Promise.all([
          api.get("/home"),          // mainsheet
          api.get("/reports/qc"),     // reports excel
          api.get("/reports/errors"), // reports excel
        ]);

          const s = homeRes.data?.summary || {};
          setSummary({
            qa_total: toNumberOrDash(s.qa_total),
            qc_total: toNumberOrDash(s.qc_total),
            rank: (s.rank === null || s.rank === undefined || String(s.rank).trim() === "") ? "-" : String(s.rank),
            accepted_errors: toNumberOrDash(s.accepted_errors),
          });


        setQcItems(qcRes.data?.items || []);
        setQcMsg(qcRes.data?.message || null);

        setErrItems(errRes.data?.items || []);
        setErrMsg(errRes.data?.message || null);
      } catch (e) {
        toast.error("خطا در دریافت گزارش‌ها");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <RequireAuth>
      <div dir="ltr" className="min-h-screen relative w-full text-right">
        <LoadingOverlay show={loading} />

        <Image
          src="/Photos/Homepage_Hero.jpg"
          alt="bg"
          fill
          className="object-cover -z-10"
        />

        {/* MENU */}
        <div className="flex justify-center pt-8 ">
          <div className="bg-white shadow-md rounded-full px-12 py-3 ">
            <ul className="flex gap-6 text-gray-400 font-medium">
              <Link href={"/report"}>
                <li
                  className={`hover:text-blue-main font-bold cursor-pointer ${
                    pathname == "/report" ? "text-blue-main" : ""
                  }`}
                >
                  گزارش‌ها
                </li>
              </Link>
              <Link href={"/notification"}>
                <li className="hover:text-blue-main cursor-pointer">اطلاع‌رسانی</li>
              </Link>
              <Link href={"/blog"}>
                <li className="hover:text-blue-main cursor-pointer">بلاگ</li>
              </Link>
              <Link href={"/profile"}>
                <li className="hover:text-blue-main cursor-pointer">پروفایل</li>
              </Link>
              <Link href={"/home"}>
                <li className="hover:text-blue-main font-bold cursor-pointer">خانه</li>
              </Link>
            </ul>
          </div>
        </div>

        {/* REPORT SECTION */}
        <div className="max-w-5xl mx-auto bg-blur-box rounded-2xl mt-8">
          <div className="rounded-2xl shadow-lg p-8">
            <p className="text-center font-semibold mb-2">خلاصه عملکرد ماهانه</p>

            <div className="flex justify-center mt-2">
              <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-semibold">
                +4.8% vs Last Month
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-8 mb-8">
              <Stat title="Total QC Score" value={summary.qc_total} />
              <Stat title="Total Accepted Errors" value={summary.accepted_errors} />
              <Stat title="Total QA Score" value={summary.qa_total} />
              <Stat title="Rank" value={summary.rank} />
            </div>
          </div>
        </div>

        {/* EMAIL CARDS (فعلا ثابت) */}
        <div className="rounded-2xl shadow-lg p-8 mt-4 bg-blur-box max-w-5xl mx-auto">
          <div className="flex justify-between rounded-md">
            <span className="w-1/3 m-2 flex flex-col rounded-md text-white border-2 shadow-md">
              <img src="/Photos/erorrEmailSvg.jpg" alt="erorrEmail" />
              <div className="flex justify-center flex-col items-center bg-red-700 mr-3 mx-3 rounded-b-md mb-2">
                <span className="mt-2">2</span>
                <span className="mb-2">ایمیل اخطار</span>
              </div>
            </span>

            <span className="w-1/3 m-2 flex flex-col rounded-md text-white shadow-md">
              <img src="/Photos/encouragementEmailSvg.jpg" alt="encouragementEmail" />
              <div className="flex justify-center flex-col items-center bg-green-700 mx-3 rounded-b-md mb-2">
                <span className="mt-2">3</span>
                <span className="mb-2">ایمیل تشویق</span>
              </div>
            </span>

            <span className="w-1/3 m-2 flex flex-col rounded-md text-white shadow-md">
              <img src="/Photos/faradEmailSvg.jpg" alt="faradEmail" />
              <div className="flex justify-center flex-col items-center bg-yellow-500 mx-3 rounded-b-md mb-2">
                <span className="mt-2">1</span>
                <span className="mb-2">ایمیل فراد</span>
              </div>
            </span>
          </div>
        </div>

        {/* QC TABLE (reports excel) */}
        <div className="rounded-2xl shadow-lg p-8 mt-4 bg-blur-box max-w-5xl mx-auto">
          <h1 className="flex justify-end font-bold text-xl mb-4">گزارش QC</h1>

          {qcItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow">
              <p className="text-lg font-bold">
                {qcMsg || "تبریک! شما توی تماس‌هات مشکلی نبوده ❤️"}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 shadow overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {Object.keys(qcItems[0]).map((k) => (
                      <th
                        key={k}
                        className="p-3 text-right font-bold text-gray-700 whitespace-nowrap"
                      >
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {qcItems.map((row, idx) => (
                    <tr key={idx} className="border-b">
                      {Object.keys(qcItems[0]).map((k) => (
                        <td key={k} className="p-3 text-right whitespace-nowrap">
                          {String(row?.[k] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ERRORS TABLE (reports excel) */}
        <div className="rounded-2xl shadow-lg p-8 mt-4 mb-10 bg-blur-box max-w-5xl mx-auto">
          <h1 className="flex justify-end font-bold text-xl mb-4">گزارش خطاها</h1>

          {errItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow">
              <p className="text-lg font-bold">
                {errMsg || "بهت تبریک می‌گم! تا الان بدون مشکل داری کار می‌کنی 💛"}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 shadow overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {Object.keys(errItems[0]).map((k) => (
                      <th
                        key={k}
                        className="p-3 text-right font-bold text-gray-700 whitespace-nowrap"
                      >
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {errItems.map((row, idx) => (
                    <tr key={idx} className="border-b">
                      {Object.keys(errItems[0]).map((k) => (
                        <td key={k} className="p-3 text-right whitespace-nowrap">
                          {String(row?.[k] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-lg font-bold text-gray-800">{String(value)}</p>
    </div>
  );
}

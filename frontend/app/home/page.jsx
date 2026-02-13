"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Menu from "@/components/Menu";
import RequireAuth from "@/components/RequireAuth";
import LoadingOverlay from "@/components/LoadingOverlay";
import ScrollReveal from "@/components/ScrollReveal";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

function firstNameFromPersian(fullName) {
  if (!fullName) return "...";
  const cleaned = String(fullName).trim().replace(/\s+/g, " ");
  return cleaned.split(" ")[0] || cleaned;
}

function toNumberOrDash(v) {
  if (v === null || v === undefined) return "-";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "-";
  const s = String(v).trim();
  if (!s) return "-";
  const cleaned = s.replace(/[%٬,]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? String(n) : "-";
}

export default function Page() {
  const [firstName, setFirstName] = useState("...");
  const [summary, setSummary] = useState({
    qa_total: "-",
    qc_total: "-",
    rank: "-",
    accepted_errors: "-",
  });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const homeRes = await api.get("/home");

        const fullName = homeRes.data?.name || "...";
        setFirstName(firstNameFromPersian(fullName));

        const s = homeRes.data?.summary || {};
        setSummary({
          qa_total: toNumberOrDash(s.qa_total),
          qc_total: toNumberOrDash(s.qc_total),
          rank: toNumberOrDash(s.rank),
          accepted_errors: toNumberOrDash(s.accepted_errors),
        });

        const notifRes = await api.get("/notifications?limit=3");
        setNews(notifRes.data?.items || []);
      } catch (e) {
        toast.error("خطا در دریافت اطلاعات");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <RequireAuth>
      <div dir="ltr" className="relative min-h-screen text-right">
        <LoadingOverlay show={loading} />

        <Image
          src="/photos/Group.png"
          alt="background"
          fill
          className="object-cover"
          priority
        />

        <div className="relative z-10">
          <Menu />

          <ScrollReveal>
            <div className="relative flex justify-center mt-10">
              <Image
                src="/Photos/homeInticonName.png"
                alt="welcome"
                width={320}
                height={320}
                priority
              />
              <div className="absolute top-6 text-white px-6 py-2 rounded-xl shadow-md text-xl">
                !{firstName} عزیز، سلام
              </div>
            </div>
          </ScrollReveal>

          {/* گزارش‌ها */}
          <ScrollReveal delay={0.05}>
            <div className="max-w-5xl mx-auto bg-white rounded-2xl">
              <div className="flex justify-end mb-4">
                <h2 className="text-xl font-bold text-gray-700 m-4">گزارش‌ها</h2>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <p className="text-center font-semibold mb-6">خلاصه عملکرد ماهانه</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <Stat title="Total QC Score" value={summary.qc_total} />
                  <Stat title="Total Accepted Errors" value={summary.accepted_errors} />
                  <Stat title="Total QA Score" value={summary.qa_total} />
                  <Stat title="Rank" value={summary.rank} />
                </div>

                <div className="flex justify-center mt-6">
                  <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-semibold">
                    +4.8% vs Last Month
                  </span>
                </div>

                <div className="flex justify-end mt-6">
                  <Link href={"/report"}>
                    <button className="bg-blue-main text-white p-2 rounded-xl hover:bg-blue-600 transition-all">
                      مشاهده بیشتر
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* آخرین اطلاع‌رسانی‌ها */}
          <ScrollReveal delay={0.1}>
            <div className="max-w-5xl mx-auto bg-white rounded-2xl mt-8">
              <div className="flex justify-end mb-4">
                <h2 className="text-xl font-bold text-gray-700 m-4">آخرین اطلاع‌رسانی‌ها</h2>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {(news || []).map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow p-6 text-sm leading-relaxed text-right"
                    >
                      {item.text}
                      <span className="block text-gray-400 mt-4 text-xs">{item.date}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <Link href={"/notification"}>
                    <button className="bg-blue-main text-white p-2 rounded-xl hover:bg-blue-600 transition-all">
                      مشاهده بیشتر
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* بلاگ‌ها */}
          <ScrollReveal delay={0.15}>
            <div className="max-w-5xl mx-auto bg-white rounded-2xl mt-8 mb-4">
              <div className="flex justify-end mb-4">
                <h2 className="text-xl font-bold text-gray-700 m-4">بلاگ‌ها</h2>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-6 w-full justify-center items-center">
                  <div className="flex flex-col mr-2">
                    <img src="/Photos/Frame 35721.png" alt="yalda" />
                  </div>

                  <div className="flex items-end justify-start mb-8 shadow-lg mt-8 rounded-2xl mr-4">
                    <Image
                      src="/Photos/ChatGPTBOT.png"
                      alt="bot"
                      width={120}
                      height={150}
                    />
                    <span className="mb-8 ml-8 font-bold">به زودی فراجی چت با هوشمند ازکی</span>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Link href={"/blog"}>
                    <button className="bg-blue-main text-white p-2 rounded-xl hover:bg-blue-600 transition-all">
                      مشاهده بیشتر
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </RequireAuth>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-lg font-bold text-gray-800">{String(value ?? "-")}</p>
    </div>
  );
}

// frontend/app/profile/page.jsx
"use client";

import Image from "next/image";
import RequireAuth from "@/components/RequireAuth";
import Menu from "@/components/Menu";
import LoadingOverlay from "@/components/LoadingOverlay";
import ScrollReveal from "@/components/ScrollReveal";
import EditProfileModal from "@/components/EditProfileModal";
import { api } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

function safe(v) {
  const s = (v ?? "").toString().trim();
  return s ? s : "—";
}
function firstNameFromPersian(fullName) {
  const s = (fullName ?? "").toString().trim().replace(/\s+/g, " ");
  if (!s) return "—";
  return s.split(" ")[0] || s;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState({
    name_persian: "—",
    position: "—",
    email_azki: "—",
    personal_email: "—",
    personnel_code: "—",
    number: "—",
  });

  const [modal, setModal] = useState({ open: false, section: null });

  const personalFields = useMemo(
    () => [
      { key: "personal_email", label: "ایمیل شخصی", placeholder: "example@gmail.com" },
      { key: "number", label: "شماره", placeholder: "09xxxxxxxxx" },
    ],
    []
  );

  const jobFields = useMemo(
    () => [{ key: "position", label: "پوزیشن", placeholder: "مثلا: QC / QA / ..." }],
    []
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get("/profile");
        const d = res?.data || {};
        setData({
          name_persian: safe(d.name_persian ?? d["Name persian"]),
          position: safe(d.position ?? d["Position"]),
          email_azki: safe(d.email_azki ?? d["Email Azki"]),
          personal_email: safe(d.personal_email ?? d["Personal Email"]),
          personnel_code: safe(d.personnel_code ?? d["Personnel Code"]),
          number: safe(d.number ?? d["Number"]),
        });
      } catch {
        toast.error("خطا در دریافت پروفایل");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function savePatch(payload) {
    setSaving(true);
    try {
      const patch = {};
      // فقط فیلدهایی که واقعاً تغییر کرده‌اند
      Object.keys(payload || {}).forEach((k) => {
        const newVal = (payload?.[k] ?? "").toString().trim();
        const oldVal = (data?.[k] ?? "").toString().trim();
        if (newVal !== oldVal) patch[k] = newVal;
      });

      if (Object.keys(patch).length === 0) {
        setModal({ open: false, section: null });
        return;
      }

      const res = await api.patch("/profile", patch);
      const d = res?.data || {};
      setData((prev) => ({
        ...prev,
        position: safe(d.position ?? prev.position),
        personal_email: safe(d.personal_email ?? prev.personal_email),
        number: safe(d.number ?? prev.number),
      }));

      toast.success("تغییرات ذخیره شد");
      setModal({ open: false, section: null });
    } catch (e) {
      toast.error("ذخیره انجام نشد");
    } finally {
      setSaving(false);
    }
  }

  const modalTitle =
    modal.section === "personal"
      ? "ویرایش اطلاعات شخصی"
      : modal.section === "job"
      ? "ویرایش اطلاعات شغلی"
      : "";

  const modalFields = modal.section === "personal" ? personalFields : jobFields;

  const modalInitial =
    modal.section === "personal"
      ? { personal_email: data.personal_email === "—" ? "" : data.personal_email, number: data.number === "—" ? "" : data.number }
      : { position: data.position === "—" ? "" : data.position };

  return (
    <RequireAuth>
      <div dir="rtl" className="min-h-screen relative w-full">
        <LoadingOverlay show={loading || saving} />

        <Image src="/Photos/Homepage_Hero.jpg" alt="bg" fill className="object-cover -z-10" priority />

        <div className="relative z-10">
          <Menu />

          <ScrollReveal>
            <div className="max-w-6xl mx-auto mt-10 bg-blur-box rounded-[32px] shadow-xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 px-6">
              <div className="text-right">
                <h1 className="text-2xl font-bold">{data.name_persian}</h1>
                <p className="text-gray-500 mt-2">{data.position}</p>
                <p className="text-gray-400 mt-1 text-sm">
                  سلام {firstNameFromPersian(data.name_persian)} عزیز 👋
                </p>
              </div>

              <div className="w-44 h-44 relative rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <Image src="/Photos/Group 34908.png" alt="profile" fill className="object-contain" />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <div className="max-w-6xl mx-auto mt-10 grid md:grid-cols-2 gap-8 px-4">
              <div className="bg-blur-box rounded-3xl shadow p-8">
                <h3 className="font-bold mb-6 text-right">اطلاعات شخصی</h3>

                <div className="space-y-4 text-sm">
                  <InfoRow label="نام" value={firstNameFromPersian(data.name_persian)} />
                  <InfoRow label="ایمیل سازمانی" value={data.email_azki} />
                  <InfoRow label="ایمیل شخصی" value={data.personal_email} />
                  <InfoRow label="شماره" value={data.number} />
                </div>

                <button
                  className="bg-blue-main text-white p-2 rounded-xl hover:bg-blue-600 transition-all mt-4"
                  onClick={() => setModal({ open: true, section: "personal" })}
                >
                  ویرایش
                </button>
              </div>

              <div className="bg-blur-box rounded-3xl shadow p-8">
                <h3 className="font-bold mb-6 text-right">اطلاعات شغلی</h3>

                <div className="space-y-4 text-sm">
                  <InfoRow label="پوزیشن" value={data.position} />
                  <InfoRow label="کد پرسنلی" value={data.personnel_code} />
                </div>

                <button
                  className="bg-blue-main text-white p-2 rounded-xl hover:bg-blue-600 transition-all mt-4"
                  onClick={() => setModal({ open: true, section: "job" })}
                >
                  ویرایش
                </button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="max-w-6xl mx-auto mt-8 bg-blur-box rounded-3xl shadow p-8 px-4">
              <h3 className="font-bold mb-6 text-right">سوابق جابجایی شغلی</h3>

              <div className="space-y-4 text-sm">
                <HistoryRow title="جابجایی به تیم آموزش" date="۱۴۰۴/۱۱/۱۴" />
                <HistoryRow title="شروع همکاری در تیم پشتیبانی" date="۱۴۰۴/۰۵/۱۸" />
              </div>

              <button
                className="bg-blue-main text-white p-2 rounded-xl hover:bg-blue-600 transition-all mt-4"
                onClick={() => toast("این بخش فعلاً دستی/ثابت است")}
              >
                ویرایش
              </button>
            </div>
          </ScrollReveal>
        </div>

        <EditProfileModal
          open={modal.open}
          title={modalTitle}
          initialValues={modalInitial}
          fields={modalFields}
          saving={saving}
          onClose={() => (saving ? null : setModal({ open: false, section: null }))}
          onSave={savePatch}
        />
      </div>
    </RequireAuth>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-1/3 flex justify-end text-gray-600">{label}</span>
      <span className="flex-1 text-right">{value}</span>
    </div>
  );
}

function HistoryRow({ title, date }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{date}</span>
      <span className="text-right">{title}</span>
    </div>
  );
}

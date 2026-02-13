// frontend/components/EditProfileModal.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function EditProfileModal({
  open,
  title,
  initialValues,
  fields,
  onClose,
  onSave,
  saving,
}) {
  const [form, setForm] = useState(initialValues || {});

  useEffect(() => {
    if (open) setForm(initialValues || {});
  }, [open, initialValues]);

  const canSubmit = useMemo(() => {
    if (!open) return false;
    return fields.some((f) => (form?.[f.key] ?? "") !== (initialValues?.[f.key] ?? ""));
  }, [open, fields, form, initialValues]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div dir="rtl" className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
            disabled={saving}
          >
            بستن
          </button>
          <h2 className="font-bold text-lg text-right">{title}</h2>
        </div>

        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key} className="text-right">
              <label className="block text-sm font-semibold mb-2">{f.label}</label>
              <input
                className="w-full input"
                placeholder={f.placeholder || ""}
                value={form?.[f.key] ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                type={f.type || "text"}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-start gap-2">
          <button
            className="bg-blue-main text-white px-5 py-2 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-60"
            disabled={!canSubmit || saving}
            onClick={async () => {
              try {
                await onSave(form);
              } catch (e) {
                toast.error("خطا در ذخیره تغییرات");
              }
            }}
          >
            {saving ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>
      </div>
    </div>
  );
}

// frontend/ui/TextField.jsx
"use client";
export default function TextField({ label, name, onChange, type = "text", value }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600 text-right">{label || name}</label>
      <input
        className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-blue-main"
        placeholder={label || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        dir="ltr"
      />
    </div>
  );
}

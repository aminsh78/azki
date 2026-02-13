// frontend/ui/SearchInput.jsx
"use client";
import { useState } from "react";

export default function SearchInput({ value, onChange, placeholder = "جستجو..." }) {
  const [internal, setInternal] = useState("");

  const v = value ?? internal;

  return (
    <div className="w-72">
      <input
        value={v}
        onChange={(e) => {
          if (onChange) onChange(e);
          if (value === undefined) setInternal(e.target.value);
        }}
        className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-blue-main text-right"
        placeholder={placeholder}
      />
    </div>
  );
}

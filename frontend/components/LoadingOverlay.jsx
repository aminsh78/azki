// frontend/components/LoadingOverlay.jsx
"use client";
import { motion } from "framer-motion";

export default function LoadingOverlay({ show, text = "در حال بارگذاری..." }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg px-6 py-5 flex items-center gap-3"
      >
        <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin" />
        <span className="text-sm text-gray-700">{text}</span>
      </motion.div>
    </div>
  );
}

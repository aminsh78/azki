// frontend/lib/formatDate.js
export function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString("fa-IR");
  } catch {
    return String(dateStr);
  }
}

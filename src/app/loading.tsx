"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid rgba(0,0,0,0.1)",
          borderTopColor: "#1a1a1a",
          borderRadius: "50%",
          animation: "spin 0.75s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";

const DiamondSpinner = dynamic(() => import("@/components/DiamondSpinner"), {
  ssr: false,
  loading: () => <div style={{ width: 100, height: 100 }} />,
});

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
      <DiamondSpinner size={100} speed={0.022} />
    </div>
  );
}

// Full Page Loading Overlay
"use client";

import { Loader2 } from "lucide-react";

// CSS Styles for Overay
const overlayStyles = {
  width: "max-content",
  position: "absolute",
  top: "50%",
  bottom: "50%",
  left: "50%",
  right: "50%",
  transform: "translate(-50%, -50%)",
};

export function LoadingOverlay({ loadingText }) {
  return (
    <div className="fixed z-50 top-0 bottom-0 left-0 right-0 bg-[#ffffff]">
      <div style={overlayStyles} className="z-50">
        <Loader2 className="animate-spin mx-auto my-3" size={45} />

        <p className="text-center text-xl text-slate-700">{loadingText}</p>
      </div>
    </div>
  );
}

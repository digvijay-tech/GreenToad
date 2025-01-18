// Full Page Loading Overlay
"use client";

import { Loader2 } from "lucide-react";


export function LoadingOverlay({ loadingText }) {
    return (
      <div className="z-50 fixed top-0 bottom-0 left-0 right-0 bg-[#ffffff]">
        <div
          style={{
            width: "max-content",
            position: "absolute",
            top: "50%",
            bottom: "50%",
            left: "50%",
            right: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <Loader2
            className="animate-spin mx-auto my-3"
            size={45}
            color="#27ae60"
          />
  
          <p className="text-center text-xl text-slate-700">
            { loadingText }
          </p>
        </div>
      </div>
    );
}

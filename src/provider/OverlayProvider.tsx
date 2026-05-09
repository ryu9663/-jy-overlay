import type { PropsWithChildren } from "react";
import "./OverlayProvider.css";

export const OverlayProvider = ({ children }: PropsWithChildren) => {
  return (
    <div className="fixed inset-[0] z-1000 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div
        className="w-[90%] max-w-[500px] rounded-[8px] bg-[#fff] p-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

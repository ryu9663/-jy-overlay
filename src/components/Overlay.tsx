import type { ReactNode } from "react";
import "./Overlay.css";

export interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Overlay = ({ isOpen, onClose, children }: OverlayProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-[0] z-[1000] flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.5)]"
      onClick={onClose}
    >
      <div
        className="w-[90%] max-w-[500px] rounded-[8px] bg-[#fff] p-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Overlay;

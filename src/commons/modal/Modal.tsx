import { ReactNode, useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, title, onClose, children }: ModalProps) {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsRendered(true), 10);
      document.body.style.overflow = "hidden";
      
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEsc);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleEsc);
      };
    } else {
      setIsRendered(false);
      document.body.style.overflow = "unset";
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 ease-out ${
        isRendered ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white w-full max-w-[600px] max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl p-6 relative flex flex-col transition-all duration-300 ease-out ${
          isRendered ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
            {title}
          </h2>
          <button 
            className="text-3xl leading-none text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="flex-1 text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}
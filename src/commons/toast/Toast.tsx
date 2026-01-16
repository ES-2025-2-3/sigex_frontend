import React, { useEffect, useState } from 'react';
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaTimes 
} from 'react-icons/fa';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsVisible(true), 10);
    
    const unmountTimer = setTimeout(() => setIsVisible(false), duration - 600);
    
    const closeTimer = setTimeout(onClose, duration);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(unmountTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose, duration]);

  const toastStyles = {
    success: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-800', icon: <FaCheckCircle className="text-green-500" /> },
    error: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-800', icon: <FaExclamationCircle className="text-red-500" /> },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-800', icon: <FaExclamationTriangle className="text-yellow-500" /> },
    info: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-800', icon: <FaInfoCircle className="text-blue-500" /> },
  };

  const style = toastStyles[type];

  return (
    <div 
      className={`
        fixed top-24 right-5 z-[9999] 
        flex items-center gap-4 min-w-[320px] max-w-[420px]
        p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] 
        border border-white/50 backdrop-blur-sm
        transition-all duration-[600ms] cubic-bezier(0.23, 1, 0.32, 1)
        ${isVisible 
          ? 'opacity-100 translate-x-0 scale-100' 
          : 'opacity-0 translate-x-12 scale-90'
        }
        ${style.bg}
      `}
    >
      <div className={`absolute left-0 top-4 bottom-4 w-1.5 rounded-r-full ${style.border.replace('border-', 'bg-')}`} />
      
      <div className="text-2xl shrink-0 ml-2">{style.icon}</div>
      
      <div className={`flex-1 text-sm font-semibold tracking-tight ${style.text}`}>
        {message}
      </div>

      <button 
        onClick={() => setIsVisible(false)} 
        className="shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors text-gray-400"
      >
        <FaTimes size={14} />
      </button>

      <div className="absolute bottom-0 left-0 h-1 bg-black/5 w-full overflow-hidden rounded-b-2xl">
        <div 
          className={`h-full transition-all duration-[4000ms] linear ${style.border.replace('border-', 'bg-')}`}
          style={{ width: isVisible ? '0%' : '100%' }}
        />
      </div>
    </div>
  );
};

export default Toast;

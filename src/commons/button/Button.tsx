import React from "react";
import { ButtonProps } from "../../types/commons/ButtonType";

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed font-sans shadow-none";
  
    const variants = {
    primary: "bg-brand-blue text-white hover:bg-brand-blue-hover",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    outline:
      "bg-transparent border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-5 py-2.5 text-base",
    large: "px-7 py-3.5 text-lg",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;

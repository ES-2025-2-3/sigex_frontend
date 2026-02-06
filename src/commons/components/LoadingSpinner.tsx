interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
}

export default function LoadingSpinner({ size = "medium" }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "w-[30px] h-[30px] border-[4px]",
    medium: "w-[100px] h-[100px] border-[14px]",
    large: "w-[300px] h-[300px] border-[42px]",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        border-[#D9D9D9]
        border-t-brand-blue
        animate-spin
        box-border
      `}
    />
  );
}

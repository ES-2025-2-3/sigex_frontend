import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
    color?: string;
    size?: "small" | "medium" | "large";
}

export default function LoadingSpinner({color = "red", size = "medium",}: LoadingSpinnerProps) {
    return <div className = "loading-spinner"/>;
}

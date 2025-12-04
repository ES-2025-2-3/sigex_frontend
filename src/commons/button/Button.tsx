import React from 'react';
import './Button.css';
import { ButtonProps } from '../../types/commons/ButtonType';

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium', 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
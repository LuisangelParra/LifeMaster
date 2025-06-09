import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md' 
}) => {
  const variants = {
    primary: 'bg-violet-100 text-violet-800 dark:bg-violet-800 dark:text-violet-100',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100',
    error: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${variants[variant]} ${sizes[size]}
    `}>
      {children}
    </span>
  );
};

export default Badge;
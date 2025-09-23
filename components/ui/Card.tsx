import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : '';
  
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
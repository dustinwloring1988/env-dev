import React from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1.5rem',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

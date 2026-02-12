import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading,
  children,
  className,
  disabled,
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    border: 'none',
    transition: 'opacity 0.2s',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#2563eb', color: 'white' },
    secondary: { backgroundColor: '#6b7280', color: 'white' },
    danger: { backgroundColor: '#ef4444', color: 'white' },
  };

  return (
    <button
      style={{ ...baseStyle, ...variants[variant], ...style }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '0.75rem',
          border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
          borderRadius: '0.375rem',
          fontSize: '1rem',
        }}
        {...props}
      />
      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
    </div>
  );
};

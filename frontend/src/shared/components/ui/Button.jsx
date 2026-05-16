/** Button — Brand-styled button with variants */
import React from 'react';

const VARIANTS = {
  primary:   { background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' },
  secondary: { background: '#F0E8DE', color: '#6B4F3A' },
  danger:    { background: '#DC2626', color: 'white' },
  ghost:     { background: 'transparent', color: '#8B6E52', border: '1px solid #E8D5C0' },
};

export default function Button({
  children, onClick, variant = 'primary', size = 'md',
  disabled = false, type = 'button', className = '', icon,
}) {
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
  const style = VARIANTS[variant] || VARIANTS.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl font-semibold transition-all
        hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40
        disabled:cursor-not-allowed ${sizes[size]} ${className}`}
      style={style}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

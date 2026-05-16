/**
 * Modal — Portal-based Reusable Modal System
 *
 * WHY THIS EXISTS:
 * Every page had inline modal code (fixed inset-0 z-50 divs). This creates:
 *  - Z-index conflicts between features
 *  - Scroll-lock inconsistencies
 *  - Copy-paste code in every file
 *
 * This modal renders into document.body via createPortal, ensuring it always
 * sits at the top of the stacking context regardless of where it's rendered.
 */

import React, { useEffect } from 'react';
import { createPortal }     from 'react-dom';
import { X }                from 'lucide-react';

/**
 * @param {boolean}  isOpen    - Controls visibility
 * @param {Function} onClose   - Called when backdrop or X is clicked
 * @param {string}   title     - Modal header title
 * @param {string}   [size]    - 'sm' | 'md' | 'lg' | 'xl' (default 'md')
 * @param {ReactNode} children - Modal body content
 * @param {ReactNode} [footer] - Modal footer content (action buttons)
 */
export default function Modal({ isOpen, onClose, title, size = 'md', children, footer }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidths[size]} rounded-2xl shadow-2xl bg-white max-h-[90vh] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: '#F0E8DE' }}
        >
          <h3
            className="text-xl font-bold"
            style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: '#8B6E52' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t flex-shrink-0" style={{ borderColor: '#F0E8DE' }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

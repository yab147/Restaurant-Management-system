/**
 * StatusBadge — Reusable Status Indicator
 *
 * WHY THIS EXISTS:
 * Every feature had its own `statusColors` object and inline badge rendering.
 * This single component handles ALL status badges across Orders, Payments,
 * Tables, Reservations, Users — with a consistent visual language.
 *
 * The brand color palette (warm browns/golds/greens) is centralized here.
 */

import React from 'react';

const STATUS_STYLES = {
  // Order statuses
  pending:    { bg: '#FEF9EE', color: '#C8862A', label: 'Pending' },
  confirmed:  { bg: '#EFF6FF', color: '#0369A1', label: 'Confirmed' },
  preparing:  { bg: '#FFFBEB', color: '#D97706', label: 'Preparing' },
  ready:      { bg: '#F0FDF4', color: '#059669', label: 'Ready' },
  served:     { bg: '#F3F4F6', color: '#6B7280', label: 'Served' },
  paid:       { bg: '#ECFDF5', color: '#059669', label: 'Paid' },
  cancelled:  { bg: '#FEF2F2', color: '#DC2626', label: 'Cancelled' },

  // Payment statuses
  completed:  { bg: '#ECFDF5', color: '#059669', label: 'Completed' },
  refunded:   { bg: '#F5F3FF', color: '#7C3AED', label: 'Refunded' },
  failed:     { bg: '#FEF2F2', color: '#DC2626', label: 'Failed' },

  // Table statuses
  available:  { bg: '#F0FDF4', color: '#059669', label: 'Available' },
  occupied:   { bg: '#FEF2F2', color: '#DC2626', label: 'Occupied' },
  reserved:   { bg: '#EFF6FF', color: '#0369A1', label: 'Reserved' },
  cleaning:   { bg: '#FFFBEB', color: '#D97706', label: 'Cleaning' },

  // User/Role statuses
  active:     { bg: '#ECFDF5', color: '#059669', label: 'Active' },
  inactive:   { bg: '#F3F4F6', color: '#6B7280', label: 'Inactive' },

  // Generic
  low:        { bg: '#FEF2F2', color: '#DC2626', label: 'Low Stock' },
  normal:     { bg: '#ECFDF5', color: '#059669', label: 'Normal' },
};

/**
 * @param {string} status    - The status value key (e.g. 'pending', 'paid')
 * @param {string} [label]   - Override the display label
 * @param {string} [size]    - 'sm' | 'md' (default 'md')
 */
export default function Badge({ status, label, size = 'md' }) {
  const style  = STATUS_STYLES[status] || { bg: '#F3F4F6', color: '#6B7280', label: status };
  const text   = label ?? style.label;
  const sizing = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold capitalize ${sizing}`}
      style={{ background: style.bg, color: style.color }}
    >
      {text}
    </span>
  );
}

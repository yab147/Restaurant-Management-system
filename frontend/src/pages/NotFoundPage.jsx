import React from 'react';
import { Link } from 'react-router-dom';
import { Home, LayoutDashboard, LogIn } from 'lucide-react';
import { ROUTES } from '../constants/routes.js';

/**
 * Not found — used inside the app shell and for unknown global URLs.
 */
export default function NotFoundPage({ variant = 'global' }) {
  const isApp = variant === 'app';

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: '#C8862A' }}>Holy Restaurant</p>
      <h1 className="text-6xl font-black mb-2" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>404</h1>
      <h2 className="text-xl font-bold mb-3" style={{ color: '#2C1810' }}>
        {isApp ? 'This workspace page does not exist' : 'Page not found'}
      </h2>
      <p className="text-sm max-w-md mb-8" style={{ color: '#8B6E52' }}>
        {isApp
          ? 'Use the sidebar to open a module, or return to your dashboard.'
          : 'The address may be mistyped, or the page was moved. You can go home or sign in to the ERP.'}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: '#F0E8DE', color: '#2C1810' }}
        >
          <Home size={16} /> Home
        </Link>
        {isApp ? (
          <Link
            to={ROUTES.DASHBOARD}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)' }}
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>
        ) : (
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #2C1810, #1A1008)' }}
          >
            <LogIn size={16} /> Sign in
          </Link>
        )}
      </div>
    </div>
  );
}

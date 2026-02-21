'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LayoutWrapper } from './components/LayoutWrapper';

export default function NotFound() {
  return (
    <LayoutWrapper>
      <div className="min-h-screen flex items-center justify-center px-4 pt-24">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[var(--accent-primary)] mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-[var(--text-inverse)] font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    </LayoutWrapper>
  );
}

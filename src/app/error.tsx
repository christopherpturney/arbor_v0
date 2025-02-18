'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream" data-theme="light">
      <div className="text-center">
        <h2 className="text-2xl font-medium mb-4 text-charcoal">Something went wrong</h2>
        <button
          onClick={() => reset()}
          className="btn btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 
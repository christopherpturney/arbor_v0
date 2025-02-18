'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <html lang="en" data-theme="light">
      <body className="bg-cream">
        <div className="min-h-screen flex items-center justify-center">
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
      </body>
    </html>
  );
} 
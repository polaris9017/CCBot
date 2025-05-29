import React from 'react';

export default function FooterComponent() {
  return (
    <footer className="sticky bottom-0 w-full bg-gray-200 border-t border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

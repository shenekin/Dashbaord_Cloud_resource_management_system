'use client';

/**
 * Footer component
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="h-12 bg-gray-100 border-t border-gray-200 flex items-center justify-center text-sm text-gray-600">
      <div className="flex items-center gap-4">
        <span>© {currentYear} Cloud Resource Management System. All rights reserved.</span>
        <span className="text-gray-400">|</span>
        <span>Version 1.0.0</span>
        <span className="text-gray-400">|</span>
        <a href="#" className="hover:text-primary transition-colors">
          Help
        </a>
        <span className="text-gray-400">|</span>
        <a href="#" className="hover:text-primary transition-colors">
          Contact
        </a>
      </div>
    </footer>
  );
}


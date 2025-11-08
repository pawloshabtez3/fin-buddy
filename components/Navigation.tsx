'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import Link from 'next/link';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
      }
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  // Don't show navigation on auth pages or home page
  if (!user || pathname === '/login' || pathname === '/signup' || pathname === '/') {
    return null;
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              FinBuddy
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/dashboard'
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/profile'
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Profile
              </Link>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

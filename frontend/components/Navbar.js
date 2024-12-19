'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.logout();
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          TeleView
        </Link>
        <div className="space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
import Link from 'next/link';

export default function AuthNav() {
  return (
    <nav className="flex items-center gap-4">
      <a href="/auth/login?returnTo=/dashboard" className="text-blue-600 underline">
        Login
      </a>
      <a href="/auth/logout?returnTo=http://localhost:3000/" className="text-blue-600 underline">
        Logout
      </a>
    </nav>
  );
}

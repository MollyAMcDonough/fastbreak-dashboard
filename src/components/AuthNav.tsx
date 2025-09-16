import Link from 'next/link';

export default function AuthNav() {
  // For v4, you can fetch user info from /auth/profile if needed
  return (
    <nav className="flex gap-4 items-center">
      <a href="/auth/login" className="text-blue-600 underline">
        Login
      </a>
      <a href="/auth/logout" className="text-blue-600 underline">
        Logout
      </a>
    </nav>
  );
}

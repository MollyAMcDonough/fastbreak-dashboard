import React from 'react';

const baseUrl = process.env.APP_BASE_URL || '';

export default function AuthNav() {
  return (
    <nav className="flex items-center gap-4">
      <a href={`/auth/login?returnTo=${baseUrl}/dashboard`} className="text-blue-600 underline">
        Login
      </a>
      <a href={`/auth/logout?returnTo=${baseUrl}`} className="text-blue-600 underline">
        Logout
      </a>
    </nav>
  );
}

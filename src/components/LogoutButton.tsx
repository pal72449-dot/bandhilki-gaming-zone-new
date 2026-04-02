"use client";

export default function LogoutButton({ className }: { className: string }) {
  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.href = '/admin/login';
  };
  return <button onClick={handleLogout} className={className}>Terminate Session</button>;
}

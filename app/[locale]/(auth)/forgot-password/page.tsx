'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { userStore } from '@/lib/stores/user-store';

export default function ForgotPasswordPage() {
  const { sendResetLink, loading } = userStore();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const result = await sendResetLink(email);
    if (result.success) {
      setMessage('✅ Check your email for a password reset link!');
    } else {
      setError(result.error || 'Failed to send reset link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full border rounded-xl shadow-lg p-8 bg-slate-900 text-white">
        <Link href="/" className="flex items-center text-blue-500 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Home
        </Link>
        <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-800 border-gray-700 text-white mt-1"
            />
          </div>

          {message && <p className="text-green-500 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </div>
    </div>
  );
}

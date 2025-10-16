// Change password for already logged in users

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { userStore } from '@/lib/stores/user-store';
import { useRouter } from 'next/navigation';

const calculateStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

export default function ChangePasswordPage() {
  const { changePassword, loading } = userStore();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const router = useRouter()

  const strength = calculateStrength(newPass);
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPass !== confirm) {
      setError('Passwords do not match');
      return;
    }

    const result = await changePassword(current, newPass);
    if (result.success) {
      setMessage('✅ Password changed successfully!');
      setCurrent('');
      setNewPass('');
      setConfirm('');
      router.replace('/')
    } else {
      setError(result.error || 'Failed to change password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full border rounded-xl shadow-lg p-8 bg-slate-900 text-white">
        <Link href="/" className="flex items-center text-blue-500 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Home
        </Link>
        <h1 className="text-2xl font-bold text-center mb-6">Change Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Current Password</label>
            <Input
              type={show ? 'text' : 'password'}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="bg-slate-800 border-gray-700 text-white mt-1"
            />
          </div>

          <div className="relative">
            <label>New Password</label>
            <Input
              type={show ? 'text' : 'password'}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="bg-slate-800 border-gray-700 text-white mt-1 pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-200 transition"
            >
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            {newPass && (
              <div className="mt-2 h-2 bg-gray-700 rounded">
                <div
                  className={`h-2 rounded ${colors[strength - 1] || 'bg-red-500'}`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
            )}
          </div>

          <div>
            <label>Confirm New Password</label>
            <Input
              type={show ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="bg-slate-800 border-gray-700 text-white mt-1"
            />
          </div>

          {message && <p className="text-green-500 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? 'Updating...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}

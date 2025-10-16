'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
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

export default function ResetPasswordPage() {
  const { resetPassword, loading } = userStore();
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

    const result = await resetPassword(newPass);
    if (result.success) {
      setMessage('Password has been reset successfully!');
      router.replace('/')
    } else {
      setError(result.error || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full border rounded-xl shadow-lg p-8 bg-slate-900 text-white">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label>Confirm Password</label>
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
            {loading ? 'Updating...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}

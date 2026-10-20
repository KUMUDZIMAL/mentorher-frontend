"use client";
import React, { Suspense, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE } from '@/lib/api';

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setVerified(true);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password updated. You can log in now.');
        setDone(true);
        setTimeout(() => router.push('/auth/login'), 2000);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-violet-50">
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
        <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
        <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
      </div>

      <div className="flex h-full w-full justify-center items-center relative z-10">
        <div className="w-96 p-6 bg-white rounded-xl shadow-lg z-20">
          <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

          {message && <p className="text-green-600 text-center mb-4">{message}</p>}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {!token && (
            <p className="text-red-500 text-center mb-4">
              Invalid reset link. Please request a new one from the{' '}
              <a href="/auth/ForgotPassword" className="underline text-violet-700">
                forgot password
              </a>{' '}
              page.
            </p>
          )}

          {token && !verified && !done && (
            <form onSubmit={handleVerify}>
              <p className="text-sm text-gray-600 mb-4">
                First verify the email address of your account.
              </p>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 hover:border-violet-700 border-2 rounded-md mt-1"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 bg-violet-700 text-white rounded-md hover:bg-violet-600 disabled:opacity-60"
              >
                {submitting ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
          )}

          {token && verified && !done && (
            <form onSubmit={handleSubmit}>
              <p className="text-sm text-green-600 mb-4">Email verified: {email}</p>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 hover:border-violet-700 border-2 rounded-md mt-1"
                  minLength={6}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirm"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full p-2 hover:border-violet-700 border-2 rounded-md mt-1"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 bg-violet-700 text-white rounded-md hover:bg-violet-600 disabled:opacity-60"
              >
                {submitting ? 'Updating...' : 'Reset Password'}
              </button>
            </form>
          )}

          <button
            onClick={() => router.push('/auth/login')}
            className="w-full py-2 mt-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

const ResetPassword = () => (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center bg-violet-50">
        <p className="text-violet-700">Loading...</p>
      </div>
    }
  >
    <ResetPasswordForm />
  </Suspense>
);

export default ResetPassword;

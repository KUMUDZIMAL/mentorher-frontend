"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://mentorher-backend.vercel.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, age, gender, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }
      router.push('/auth/login');
    } catch (err) {
      console.error('Error during registration:', err);
      setError('An error occurred during registration');
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen w-full relative justify-center items-center bg-pink-50">
      {/* Background Pastel Circles */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="absolute w-96 h-96 bg-pink-300/30 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-300/30 rounded-full blur-3xl top-40 left-60"></div>
        <div className="absolute w-80 h-80 bg-pink-200/30 rounded-full blur-3xl bottom-0 right-20"></div>
        <div className="absolute w-72 h-72 bg-purple-200/30 rounded-full blur-3xl -right-20 top-10"></div>
        <div className="absolute w-80 h-80 bg-yellow-200/30 rounded-full blur-3xl top-0 right-60"></div>
        <div className="absolute w-80 h-80 bg-pink-200/30 rounded-full blur-3xl top-20 left-20"></div>
      </div>

      {/* Registration Form */}
      <div className="w-96 p-6 bg-white rounded-xl shadow-lg z-10">
        <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border-2 rounded-md mt-1 hover:border-pink-600 focus:outline-none focus:border-pink-600"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border-2 rounded-md mt-1 hover:border-pink-600 focus:outline-none focus:border-pink-600"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              id="age"
              value={age !== null ? age : ''}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : null)}
              className="w-full p-2 border-2 rounded-md mt-1 hover:border-pink-600 focus:outline-none focus:border-pink-600"
            />
          </div>

       

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border-2 rounded-md mt-1 hover:border-pink-600 focus:outline-none focus:border-pink-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="text-pink-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

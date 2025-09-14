// src/app/[locale]/account/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { login } from '@/app/actions/account';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [error, setError] = useState(null);
  const router = useRouter();
  const locale = useLocale();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    const result = await login(email, password);

    if (result.customerUserErrors.length > 0) {
      setError(result.customerUserErrors[0].message);
      return;
    }

    if (result.customerAccessToken) {
      router.push(`/${locale}/account/dashboard`);
    }
  }

  return (
    <main className="container mx-auto p-8">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-md border-secondary shadow-sm focus:border-primary focus:ring-primary px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full rounded-md border-secondary shadow-sm focus:border-primary focus:ring-primary px-3 py-2"

            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" variant="primary" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </main>
  );
}
// src/app/[locale]/account/register/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { register } from '@/app/actions/account';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function RegisterPage() {
  const [error, setError] = useState(null);
  const router = useRouter();
  const locale = useLocale();

  async function handleRegister(e) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    const passwordConfirm = String(formData.get('passwordConfirm') || '');

    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    const result = await register(email, password);

    if (result.customerUserErrors.length > 0) {
      setError(result.customerUserErrors[0].message);
      return;
    }

    if (result.customer) {
      alert('Account created successfully! Please log in.');
      router.push(`/${locale}/account/login`);
    }
  }

  return (
    <main className="container mx-auto p-8">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold text-center">Create Account</h1>
        <form onSubmit={handleRegister} className="mt-8 space-y-6">
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
              required
              className="mt-1 block w-full rounded-md border-secondary shadow-sm focus:border-primary focus:ring-primary px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              required
              className="mt-1 block w-full rounded-md border-secondary shadow-sm focus:border-primary focus:ring-primary px-3 py-2"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" variant="primary" className="w-full">
            Create Account
          </Button>

          <p className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/account/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
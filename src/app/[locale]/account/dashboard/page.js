// src/app/[locale]/account/dashboard/page.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCustomer } from '@/lib/shopify';
import OrderHistory from '../OrderHistory';

export default async function DashboardPage({ params }) {
  const { locale } = await params;
  const cookieJar = await cookies();
  const accessToken = cookieJar.get('customerAccessToken')?.value;

  // 1. Check for the session token. If it doesn't exist, redirect to login.
  if (!accessToken) {
    redirect(`/${locale}/account/login`);
  }

  // 2. Fetch the customer's data using the token.
  const customer = await getCustomer(accessToken);

  // Fallback if the token is invalid or expired
  if (!customer) {
    redirect(`/${locale}/account/login`);
  }
  
  return (
    <main className="container mx-auto p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Welcome, {customer.firstName}</h1>
        <p className="mt-4 text-foreground/80">
          This is your account dashboard. You can view your past orders below.
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Order History</h2>
          <OrderHistory orders={customer.orders.edges.map(e => e.node)} />
        </div>
      </div>
    </main>
  );
}
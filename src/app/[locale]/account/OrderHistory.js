// src/app/[locale]/account/OrderHistory.js
import { formatMoney } from '@/lib/market-utils';

// Helper to style the status badges
function StatusBadge({ status }) {
  const statusStyles = {
    PAID: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    FULFILLED: 'bg-blue-100 text-blue-800',
    UNFULFILLED: 'bg-gray-100 text-gray-800',
  };
  const normalizedStatus = status.toUpperCase();
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        statusStyles[normalizedStatus] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {normalizedStatus}
    </span>
  );
}

export default function OrderHistory({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="mt-4 rounded-lg border auvra-border p-8 text-center">
        <p className="text-foreground/60">You have not placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y auvra-divide">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">Order</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Payment Status</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Fulfillment Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-right text-sm font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y auvra-divide">
              {orders.map((order) => (
                <tr key={order.orderNumber}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0">#{order.orderNumber}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-foreground/80">{new Date(order.processedAt).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-foreground/80"><StatusBadge status={order.financialStatus} /></td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-foreground/80"><StatusBadge status={order.fulfillmentStatus} /></td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">{formatMoney(order.totalPrice.amount, order.totalPrice.currencyCode)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
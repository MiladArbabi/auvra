import { isEU, shippingNote } from '@/lib/market';

export default function VatNote({ country, tag }) {
  const eu = isEU(country);
  return (
    <div className="text-xs text-neutral-500 mt-1 space-y-0.5">
      <p>{eu ? 'VAT included' : 'Taxes calculated at checkout'}</p>
      <p>{shippingNote(country, tag)}</p>
    </div>
  );
}
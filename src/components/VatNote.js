import {isEU} from '@/lib/market';

export default function VatNote({country}) {
  const eu = isEU(country);
  return (
    <p className="text-xs text-neutral-500 mt-1">
      {eu ? 'VAT included' : 'Taxes calculated at checkout'}
    </p>
  );
}

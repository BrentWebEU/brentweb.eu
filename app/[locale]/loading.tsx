import { Skeleton } from '@/components/ui/skeleton';

export default function LocaleLoading() {
  return (
    <div className="py-20 mx-auto w-full max-w-7xl px-6" aria-busy="true" aria-live="polite">
      <Skeleton style={{ height: '3rem', width: '60%', marginBottom: '1.5rem' }} />
      <Skeleton style={{ height: '1.25rem', width: '85%', marginBottom: '0.75rem' }} />
      <Skeleton style={{ height: '1.25rem', width: '70%', marginBottom: '3rem' }} />
      <Skeleton style={{ height: '18rem', width: '100%' }} />
    </div>
  );
}

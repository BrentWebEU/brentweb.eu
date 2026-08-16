'use client';

import dynamic from 'next/dynamic';

const RateLimitSimulator = dynamic(
  () => import('@/components/tech/lab/RateLimitSimulator').then((m) => m.RateLimitSimulator),
  { ssr: false }
);
const AuthFlowVisualizer = dynamic(
  () => import('@/components/tech/lab/AuthFlowVisualizer').then((m) => m.AuthFlowVisualizer),
  { ssr: false }
);
const StateVisualizer = dynamic(
  () => import('@/components/tech/lab/StateVisualizer').then((m) => m.StateVisualizer),
  { ssr: false }
);

export function LabWidgets() {
  return (
    <div className="lab-grid">
      <RateLimitSimulator />
      <AuthFlowVisualizer />
      <StateVisualizer />
    </div>
  );
}

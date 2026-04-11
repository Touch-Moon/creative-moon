import type { Metadata } from 'next';
import ManifestoPage from '@/components/manifesto/ManifestoPage';

export const metadata: Metadata = {
  title: 'Manifesto',
  description: 'Values and principles — what drives the work and shapes every digital experience at Creative Moon.',
  alternates: { canonical: '/manifesto' },
};

export default function Manifesto() {
  return (
    <main>
      <ManifestoPage />
    </main>
  );
}

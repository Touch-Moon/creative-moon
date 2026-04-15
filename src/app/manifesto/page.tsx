import type { Metadata } from 'next';
import ManifestoPage from '@/components/manifesto/ManifestoPage';

export const metadata: Metadata = {
  title: 'Manifesto',
  description: 'My values and principles — what drives my work and shapes every digital experience I create.',
  alternates: { canonical: '/manifesto' },
};

export default function Manifesto() {
  return (
    <main>
      <ManifestoPage />
    </main>
  );
}

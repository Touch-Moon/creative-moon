import type { Metadata } from 'next';
import AboutPage from '@/components/about/AboutPage';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Creative Moon — a design-driven studio focused on crafting interactive, high-quality digital experiences.',
  alternates: { canonical: '/about' },
};

export default function About() {
  return (
    <main>
      <AboutPage />
    </main>
  );
}

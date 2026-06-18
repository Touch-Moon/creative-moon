import type { Metadata } from 'next';
import AboutPage from '@/components/about/AboutPage';

export const metadata: Metadata = {
  title: 'About',
  description: "I'm a designer based in Canada. I make functional things beautiful, always for the people who use them, and build them myself, from the first idea to the last detail.",
  alternates: { canonical: '/about' },
};

export default function About() {
  return (
    <main>
      <AboutPage />
    </main>
  );
}

import type { Metadata } from 'next';
import AboutPage from '@/components/about/AboutPage';

export const metadata: Metadata = {
  title: 'About',
  description: "About me — I'm a Design Engineer based in Canada. I design in Figma and ship in Next.js, focused on interaction-driven digital experiences.",
  alternates: { canonical: '/about' },
};

export default function About() {
  return (
    <main>
      <AboutPage />
    </main>
  );
}

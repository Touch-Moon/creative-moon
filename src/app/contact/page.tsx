import type { Metadata } from 'next';
import ContactPage from '@/components/contact/ContactPage';

export const metadata: Metadata = {
  title: 'Contact',
  description: "Get in touch — let's talk about your project. Available for design, engineering, and full-stack web work.",
  alternates: { canonical: '/contact' },
};

export default function Contact() {
  return (
    <main>
      <ContactPage />
    </main>
  );
}

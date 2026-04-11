import type { Metadata } from 'next';
import ContactPage from '@/components/contact/ContactPage';

export const metadata: Metadata = {
  title: 'Contact',
  description: "Get in touch with Creative Moon — let's talk about your project.",
  alternates: { canonical: '/contact' },
};

export default function Contact() {
  return (
    <main>
      <ContactPage />
    </main>
  );
}

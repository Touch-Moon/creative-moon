import PolicyPage from '@/components/policy/PolicyPage';
import type { PolicySection } from '@/components/policy/PolicyPage';

export const metadata = {
  title: 'Privacy Policy | Creative Moon',
  description: 'Learn how Creative Moon handles your personal information and protects your privacy.',
};

const sections: PolicySection[] = [
  {
    id: 'overview',
    number: '01',
    title: 'Overview',
    paragraphs: [
      'Creative Moon ("we", "us", or "our") operates a portfolio website to showcase our web design and creative work. This Privacy Policy explains how we collect, use, and protect the limited personal information you may provide when visiting our site or contacting us.',
      'This policy applies to all visitors of our website regardless of location. We are committed to handling your data responsibly and transparently, and we only collect information that is necessary for the operation of this website and to respond to your inquiries.',
    ],
  },
  {
    id: 'information-we-collect',
    number: '02',
    title: 'Information We Collect',
    paragraphs: [
      'We collect very limited personal information through this website. The data we may collect includes:',
    ],
    list: [
      'Contact form submissions: your name, email address, and message content when you voluntarily reach out to us through our contact page.',
      'Usage data: pseudonymized usage data such as pages visited, time spent on pages, referral sources, and general geographic location (country/city level) collected through analytics technologies. This data is not fully anonymized and may be linked to your device or browser session.',
      'Technical data: browser type, device type, operating system, IP address (truncated), and screen resolution collected automatically to help us improve our website experience.',
    ],
  },
  {
    id: 'legal-basis',
    number: '03',
    title: 'Legal Basis for Processing',
    paragraphs: [
      'We process your personal data on the following legal grounds:',
    ],
    list: [
      'Consent: When you submit a contact form or accept non-essential cookies, you provide explicit consent for us to process that data for the stated purpose. You may withdraw consent at any time.',
      'Legitimate interest: We have a legitimate interest in understanding how visitors use our website to improve our services and online presence, provided this does not override your fundamental rights and freedoms.',
    ],
  },
  {
    id: 'how-we-use',
    number: '04',
    title: 'How We Use Your Information',
    paragraphs: [
      'The information we collect is used solely for the following purposes:',
    ],
    list: [
      'To respond to your inquiries submitted through our contact form.',
      'To understand how visitors interact with our website and improve its design and content.',
      'To measure the effectiveness of our portfolio in reaching potential clients and collaborators.',
      'To maintain the security and proper functioning of our website.',
    ],
  },
  {
    id: 'data-sharing',
    number: '05',
    title: 'Data Sharing & Third Parties',
    paragraphs: [
      'We do not sell, trade, or rent your personal information to any third parties. We may share limited data with the following service providers who assist in operating our website:',
    ],
    list: [
      'Google Analytics: Used for website traffic analysis. Google processes this data on our behalf and may transfer data to servers located outside your country of residence, including the United States. Google\'s data processing is governed by their privacy policy and applicable data processing agreements.',
      'Hosting providers that store and serve our website content.',
      'Email services used to receive and respond to contact form submissions.',
    ],
  },
  {
    id: 'international-transfers',
    number: '06',
    title: 'International Data Transfers',
    paragraphs: [
      'Some of our third-party service providers, particularly Google Analytics, may process data on servers located outside your country of residence. When data is transferred internationally, we rely on appropriate safeguards such as standard contractual clauses or the service provider\'s compliance with applicable data protection frameworks.',
      'By using our website and consenting to analytics cookies, you acknowledge that your data may be processed in jurisdictions with different data protection laws than your own.',
    ],
  },
  {
    id: 'data-retention',
    number: '07',
    title: 'Data Retention',
    paragraphs: [
      'Contact form submissions are retained for up to 12 months after your inquiry has been resolved, unless ongoing correspondence requires longer retention. Analytics data is retained for up to 14 months in pseudonymized form, after which it is automatically deleted.',
      'You may request the deletion of your personal data at any time by contacting us using the information provided at the end of this policy.',
    ],
  },
  {
    id: 'your-rights',
    number: '08',
    title: 'Your Rights',
    paragraphs: [
      'Depending on your location and applicable laws, you may have certain rights regarding your personal data. These may include:',
    ],
    list: [
      'The right to access and receive a copy of the personal data we hold about you.',
      'The right to request correction of inaccurate personal data.',
      'The right to request deletion of your personal data.',
      'The right to restrict or object to certain types of data processing.',
      'The right to withdraw consent for data processing at any time, without affecting the lawfulness of processing based on consent before its withdrawal.',
      'The right to lodge a complaint with your local data protection authority.',
    ],
  },
  {
    id: 'children',
    number: '09',
    title: 'Children\'s Privacy',
    paragraphs: [
      'Our website is not directed at individuals under the age of 16, and we do not knowingly collect personal information from children. If we become aware that we have inadvertently collected personal data from a child under 16, we will take steps to delete that information as soon as possible. If you believe a child has provided us with personal data, please contact us immediately.',
    ],
  },
  {
    id: 'security',
    number: '10',
    title: 'Security',
    paragraphs: [
      'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our website uses HTTPS encryption to secure data transmission between your browser and our servers.',
      'While we strive to protect your personal data, no method of transmission over the internet is completely secure. We cannot guarantee absolute security, but we are committed to promptly addressing any data breach in accordance with applicable law.',
    ],
  },
  {
    id: 'changes',
    number: '11',
    title: 'Changes to This Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Any changes will be posted on this page with an updated revision date. If we make material changes that significantly affect how we handle your personal data, we will make reasonable efforts to notify you.',
    ],
  },
  {
    id: 'contact',
    number: '12',
    title: 'Contact',
    paragraphs: [
      'If you have any questions about this Privacy Policy, wish to exercise your rights regarding your personal data, or have concerns about how your information is being handled, please contact us at hello@creativemoon.studio or through our contact page. We will respond to your request within 30 days.',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <main>
      <PolicyPage
        label="Legal"
        title="Privacy Policy"
        updatedDate="February 2026"
        sections={sections}
      />
    </main>
  );
}

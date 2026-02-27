import PolicyPage from '@/components/policy/PolicyPage';
import type { PolicySection } from '@/components/policy/PolicyPage';

export const metadata = {
  title: 'Cookies Policy | Creative Moon',
  description: 'Learn about how Creative Moon uses cookies and similar technologies on our website.',
};

const sections: PolicySection[] = [
  {
    id: 'what-are-cookies',
    number: '01',
    title: 'What Are Cookies',
    paragraphs: [
      'Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.',
      'This Cookies Policy explains what cookies we use on the Creative Moon portfolio website, why we use them, and how you can manage your preferences. This policy should be read alongside our Privacy Policy, which provides further detail on how we handle personal data.',
    ],
  },
  {
    id: 'cookies-we-use',
    number: '02',
    title: 'Cookies We Use',
    paragraphs: [
      'We use a limited number of cookies on this website. Our cookies fall into the following categories:',
    ],
    list: [
      'Essential cookies: These are necessary for the website to function properly. They enable core features such as page navigation and remembering your cookie consent choice. These cookies do not require your consent and do not collect personal information. Example: cookie consent preference (duration: 12 months).',
      'Analytics cookies: We use Google Analytics (GA4) to understand how visitors interact with our website. These cookies collect pseudonymized data — including pages visited, session duration, referral sources, and truncated IP addresses. These cookies are only placed after you provide consent. Example: _ga (duration: up to 14 months).',
    ],
  },
  {
    id: 'purpose',
    number: '03',
    title: 'Purpose of Our Cookies',
    paragraphs: [
      'As a portfolio website for a web designer, our use of cookies is minimal and focused on:',
    ],
    list: [
      'Understanding which projects and content visitors find most engaging.',
      'Measuring traffic sources to evaluate the effectiveness of our online presence.',
      'Improving website performance and user experience based on real usage data.',
      'Remembering your cookie consent preferences so we do not ask you repeatedly.',
    ],
  },
  {
    id: 'third-party',
    number: '04',
    title: 'Third-Party Cookies',
    paragraphs: [
      'Some cookies on our site may be set by third-party services. We want to be transparent about these:',
    ],
    list: [
      'Google Analytics (GA4): Collects pseudonymized website usage statistics. Data may be transferred to Google servers located in the United States. Google processes this data in accordance with their own privacy policy. You can opt out by installing the Google Analytics Opt-out Browser Add-on (tools.google.com/dlpage/gaoptout).',
      'Embedded content: If we embed content from external platforms (such as Behance, Vimeo, or YouTube), those platforms may set their own cookies when you interact with the embedded content. We do not control these third-party cookies, and we recommend reviewing the respective platform\'s cookie policy for details.',
    ],
  },
  {
    id: 'consent',
    number: '05',
    title: 'Your Consent',
    paragraphs: [
      'In accordance with applicable data protection regulations, we only place non-essential cookies (such as analytics cookies) on your device after you have given your explicit consent. Essential cookies that are strictly necessary for the website to function do not require consent.',
      'You can change or withdraw your consent at any time. If you wish to withdraw consent for analytics cookies, you can clear your browser cookies and upon your next visit, you will be asked for consent again. Alternatively, you can manage cookies through your browser settings as described below.',
    ],
  },
  {
    id: 'managing-cookies',
    number: '06',
    title: 'Managing Cookies',
    paragraphs: [
      'You have several options for managing cookies:',
    ],
    list: [
      'Browser settings: Most web browsers allow you to view, block, or delete cookies through their settings. Please note that blocking all cookies may affect website functionality.',
      'Analytics opt-out: You can specifically opt out of Google Analytics tracking by using the official Google Analytics Opt-out Browser Add-on, available at tools.google.com/dlpage/gaoptout.',
      'Device settings: On mobile devices, you can typically manage cookie preferences through your device\'s browser settings.',
    ],
  },
  {
    id: 'data-collected',
    number: '07',
    title: 'Data Collected Through Cookies',
    paragraphs: [
      'The analytics cookies on our site collect the following types of pseudonymized data:',
    ],
    list: [
      'Pages and projects you view on our website.',
      'How long you spend on each page.',
      'How you arrived at our website (search engine, social media, direct link, etc.).',
      'General geographic location (country and city level only, derived from truncated IP address).',
      'Device type and browser information for optimizing our website design.',
    ],
  },
  {
    id: 'changes',
    number: '08',
    title: 'Changes to This Policy',
    paragraphs: [
      'We may update this Cookies Policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. Any changes will be posted on this page with an updated revision date. If we introduce new categories of cookies, we will seek your consent before placing them.',
    ],
  },
  {
    id: 'contact',
    number: '09',
    title: 'Contact',
    paragraphs: [
      'If you have any questions about our use of cookies or this policy, please contact us at hello@creativemoon.studio or through our contact page. For more information about how we handle your personal data, please refer to our Privacy Policy.',
    ],
  },
];

export default function CookiesPolicy() {
  return (
    <main>
      <PolicyPage
        label="Legal"
        title="Cookies Policy"
        updatedDate="February 2026"
        sections={sections}
      />
    </main>
  );
}

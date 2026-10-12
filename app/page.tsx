import type { Metadata } from 'next';
import { Landing } from '../components/landing/Landing';
import { CONTACT_CITY, CONTACT_EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/site';

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — AI solar panel monitoring that tells you what’s wrong` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      email: CONTACT_EMAIL,
      address: { '@type': 'PostalAddress', addressLocality: 'Lucknow', addressRegion: 'Uttar Pradesh', addressCountry: 'IN' },
      contactPoint: [{ '@type': 'ContactPoint', email: CONTACT_EMAIL, contactType: 'sales', areaServed: 'IN', availableLanguage: ['en', 'hi'] }],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { '@id': `${SITE_URL}/#org` },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#org` },
      offers: [
        { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'INR' },
        { '@type': 'Offer', name: 'Starter', price: '499', priceCurrency: 'INR', description: 'Up to 10 real solar panels, monthly' },
        { '@type': 'Offer', name: 'Pro', price: '1499', priceCurrency: 'INR', description: 'Unlimited panels, monthly' },
      ],
      featureList: [
        'Real-time telemetry every 2 seconds over WebSocket',
        'AI fault detection for dust, heat, shading, inverter and wiring issues',
        'AI copilot grounded in live telemetry and hardware manuals',
        'Alerts with cause, action and estimated daily loss',
        '25-year degradation and warranty projection',
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How often does GridSense read my solar panels?',
          acceptedAnswer: { '@type': 'Answer', text: 'An ESP32 sensor kit on each panel streams voltage, current, power, temperature, irradiance and humidity every two seconds over a live socket.' },
        },
        {
          '@type': 'Question',
          name: 'What faults can GridSense detect?',
          acceptedAnswer: { '@type': 'Answer', text: 'Dust and soiling, temperature spikes, partial shading, inverter faults and wiring issues. Each alert includes the cause, the action to take and an estimated daily loss.' },
        },
        {
          '@type': 'Question',
          name: 'Can I try GridSense for free?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. The Free plan includes six simulated panels with live monitoring, AI fault detection and alerts. Paid plans connect your real sensors.' },
        },
        {
          '@type': 'Question',
          name: 'Where is GridSense based?',
          acceptedAnswer: { '@type': 'Answer', text: `GridSense is based in ${CONTACT_CITY}. Email ${CONTACT_EMAIL} to book a free site survey.` },
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <noscript>
        <style>{'.preloader{display:none!important}'}</style>
      </noscript>
      <Landing />
    </>
  );
}

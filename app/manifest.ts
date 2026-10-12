import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION, SITE_NAME } from '../lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — AI solar monitoring`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#07070A',
    theme_color: '#07070A',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}

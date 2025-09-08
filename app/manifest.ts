import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Math Flow',
    short_name: 'Math Flow',
    description: 'An AI math problem solving tool.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}

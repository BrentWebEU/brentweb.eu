import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.brentweb.eu';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
      // locale alternates
      alternates: {
        languages: {
          'en': `${baseUrl}`,
          'nl-BE': `${baseUrl}/nl-BE`,
        },
      },
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      alternates: {
        languages: {
          'en': `${baseUrl}/privacy`,
          'nl-BE': `${baseUrl}/nl-BE/privacy`,
        },
      },
    },
  ];
}

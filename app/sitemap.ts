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
      alternates: [
        { hreflang: 'en', url: `${baseUrl}` },
        { hreflang: 'nl-BE', url: `${baseUrl}/nl-BE` },
      ],
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      alternates: [
        { hreflang: 'en', url: `${baseUrl}/privacy` },
        { hreflang: 'nl-BE', url: `${baseUrl}/nl-BE/privacy` },
      ],
    },
  ];
}

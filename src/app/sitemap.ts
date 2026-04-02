import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://bandhilkigaming.com', // To be replaced with final production domain
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://bandhilkigaming.com/#pricing',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  ];
}

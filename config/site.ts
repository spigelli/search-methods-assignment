export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Next.js',
  description:
    'Beautifully designed components built with Radix UI and Tailwind CSS.',
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Search Methods',
      href: '/search-methods/playground',
    },
  ],
  links: {
    github: 'https://github.com/spigelli/search-methods-assignment',
  },
}

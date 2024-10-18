import { title } from "process";

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
      title: 'Live Demos',
      href: '/live-demos',
    },
    {
      title: 'Experience',
      href: '/experience',
    },
  ],
  links: {
    github: 'https://github.com/spigelli/search-methods-assignment',
  },
}

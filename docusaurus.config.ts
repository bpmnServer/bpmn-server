import type { Config } from '@docusaurus/types';

import { themes } from "prism-react-renderer"

const organizationName = "bpmnServer";
const projectName = "bpmn-server";


export default {
  title: "bpmn-Server Docs",
  tagline: "API and usage or bpmn-server npm package.",
  url: `https://${organizationName}.github.io`,
  baseUrl: `/${projectName}/`,
  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "ignore",
  favicon: "images/favicon.ico",
  // GitHub Pages adds a trailing slash by default that I don't want
  trailingSlash: false,
  // themes: ['@docusaurus/theme-search-algolia'],
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName, // Usually your GitHub org/user name.
  projectName, // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },




  presets: [
/*    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebar.js',
        },
      },
    ],*/
  [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebar.js',
          // sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: `https://github.com/${organizationName}/${projectName}/tree/master/docs/`,
          routeBasePath: '/',
        },
        theme: {
          // customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    (
      
      {

        algolia: {
          // The application ID provided by Algolia
          appId: '9MJK98NCGG',
    
          // Public API key: it is safe to commit it
          apiKey: '81bd390c1662182d8e821e85858c4ddc',
    
          indexName: 'bpmn-server',
    
          // Optional: see doc section below
          contextualSearch: true,
    
          // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
          externalUrlRegex: 'external\\.com|domain\\.com',
    
          // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
          replaceSearchResultPathname: {
            from: '/docs/', // or as RegExp: /\/docs\//
            to: '/',
          },
    
          // Optional: Algolia search parameters
          searchParameters: {},
    
          // Optional: path for search page that enabled by default (`false` to disable it)
          searchPagePath: 'search',
    
          //... other Algolia params
        },

      navbar: {
        title: "bpmn-Server Docs",
        logo: {
          alt: "Logo",
          // temporary logo, change this when we have a real one
          // it will try to load `static/images/Logo.png` if provided `"/images/Logo.png"`.
          src: "/images/Logo.png",
        },
        items: [
          {
            type: "doc",
            docId: "tutorial",
            position: "left",
            label: "Tutorial",
          },
          { to: "api", label: "API", position: "left" },
          {
            href: `https://github.com/${organizationName}/${projectName}`,
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Tutorial",
                to: "api-summary",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/bpmn-server",
              },
              {
                label: "Discord",
                href: "https://discordapp.com/invite/bpmn-server",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/bpmn-server",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "API",
                to: "api",
              },
              {
                label: "GitHub",
                href: `https://github.com/${organizationName}/${projectName}`,
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} bpmnServer. Doc site built with Docusaurus.`,
      },
      prism: {
        theme: themes.vsLight,
        darkTheme: themes.vsDark,
      },
    }),
} satisfies Config;

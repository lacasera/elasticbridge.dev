import { defineConfigWithTheme } from "vitepress";
import baseConfig, { ThemeConfig } from "vitepress-carbon/config";

// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme<ThemeConfig>({
  lang: "en-US",
  ignoreDeadLinks: true,
  title: "Laravel Elastic Bridge",
  description: "An Eloquent Way to Search",
  extends: baseConfig,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Get Started", link: "/docs/installation" },
    ],

    sidebar: [
      {
        text: "Get Started",
        items: [
          { text: "Installation", link: "/docs/installation" },
          { text: "Generating Bridges", link: "/docs/generating-bridges" },
          { text: "Retrieving Bridges", link: "/docs/retrieving-bridges" },
          { text: "Full Text Search", link: "/docs/fulltext-search" },
          { text: "Filters", link: "/docs/filters" },
          // { text: "Highlighting", link: "/docs/highlighting" },
          { text: "Updates and Inserts", link: "/docs/updates-and-inserts" },
          { text: "Pagination", link: "/docs/pagination" },
          { text: "Testing", link: "/docs/testing" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/lacasera/elastic-bridge" },
    ],
  },
  lastUpdated: true,
  markdown: {
    theme: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
    lineNumbers: true,
  },
});

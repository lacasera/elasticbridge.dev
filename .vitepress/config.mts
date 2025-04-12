import { defineConfigWithTheme } from "vitepress";
import baseConfig, { ThemeConfig } from "vitepress-carbon/config";

// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme<ThemeConfig>({
  lang: "e-US",
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
        text: "Installation",
        items: [
          { text: "Generating Bridges", link: "/docs/generating-bridges.md" },
          { text: "Retriving Bridges", link: "/docs/retrieving-bridges" },
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
    lineNumbers: true
  },
});

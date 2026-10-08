import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

/** Keep the source fence. Shiki has no mermaid grammar. */
function remarkMermaidAsText() {
  return (tree) => {
    const walk = (node) => {
      if (node?.type === "code" && node.lang === "mermaid") {
        node.lang = "text";
      }
      if (Array.isArray(node?.children)) {
        node.children.forEach(walk);
      }
    };
    walk(tree);
  };
}

export default defineConfig({
  site: "https://ojggg.github.io",
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkMermaidAsText],
    shikiConfig: {
      theme: "github-dark",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

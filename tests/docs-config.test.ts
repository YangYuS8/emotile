import { describe, expect, it } from "vitest";

type NavItem = {
  text?: string;
  items?: NavItem[];
};

function collectNavText(nav: NavItem[] = []): string[] {
  return nav.flatMap((item) => [
    ...(item.text ? [item.text] : []),
    ...collectNavText(item.items),
  ]);
}

describe("VitePress docs config", () => {
  it("uses the built-in locale switcher instead of manual language nav items", async () => {
    const config = (await import("../docs/.vitepress/config.mjs")).default;

    expect(config.locales.root.label).toBe("English");
    expect(config.locales.zh.label).toBe("中文");
    expect(collectNavText(config.themeConfig.nav)).not.toContain("Languages");
    expect(
      collectNavText(config.locales.zh.themeConfig.nav),
    ).not.toContain("语言");
  });
});

// A small markdown subset for the four new posts. Existing posts stay on the plain
// paragraph renderer, so this only runs for bodies stored as markdown.

export type Inline =
  | { type: "text"; text: string }
  | { type: "strong"; text: string }
  | { type: "em"; text: string }
  | { type: "link"; text: string; href: string };

export type BlogBlock =
  | { type: "h2"; inlines: Inline[] }
  | { type: "h3"; inlines: Inline[] }
  | { type: "p"; lines: Inline[][] }
  | { type: "faq"; question: string; lines: Inline[][] }
  | { type: "ul"; items: Inline[][] }
  | { type: "ol"; items: Inline[][] }
  | { type: "quote"; lines: Inline[][] };

const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

export function parseInlines(source: string): Inline[] {
  const inlines: Inline[] = [];
  let last = 0;
  for (const match of source.matchAll(INLINE)) {
    const index = match.index ?? 0;
    if (index > last) inlines.push({ type: "text", text: source.slice(last, index) });
    if (match[1] !== undefined && match[2] !== undefined) {
      inlines.push({ type: "link", text: match[1], href: match[2] });
    } else if (match[3] !== undefined) {
      inlines.push({ type: "strong", text: match[3] });
    } else if (match[4] !== undefined) {
      inlines.push({ type: "em", text: match[4] });
    }
    last = index + match[0].length;
  }
  if (last < source.length) inlines.push({ type: "text", text: source.slice(last) });
  return inlines;
}

export type BlogHref =
  | { kind: "blog"; slug: string }
  | { kind: "podcast" }
  | { kind: "internal"; path: string }
  | { kind: "external"; href: string };

// Root-relative blog and podcast links stay on this site. Everything else opens as written.
export function blogHref(href: string): BlogHref {
  let path = href;
  if (/^https?:\/\//i.test(href)) {
    try {
      const url = new URL(href);
      if (url.hostname !== "www.gswau.com" && url.hostname !== "gswau.com") {
        return { kind: "external", href };
      }
      path = url.pathname;
    } catch {
      return { kind: "external", href };
    }
  }
  if (!path.startsWith("/")) return { kind: "external", href };
  const blog = /^\/blog\/([A-Za-z0-9][A-Za-z0-9_-]*)\/?$/.exec(path);
  const slug = blog?.[1];
  if (slug) return { kind: "blog", slug };
  if (path === "/podcast" || path === "/podcast/") return { kind: "podcast" };
  return { kind: "internal", path };
}

function linesOf(block: string) {
  return block
    .split("\n")
    .map((line) => line.replace(/\s+$/u, ""))
    .filter((line) => line.length > 0);
}

const questionLine = /^\*\*(.+)\*\*$/u;

export function parseBlogBlocks(markdown: string): BlogBlock[] {
  const blocks = markdown
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  return blocks.map((block) => {
    const lines = linesOf(block);
    const first = lines[0] ?? "";
    if (lines.length === 1 && first.startsWith("### ")) {
      return { type: "h3", inlines: parseInlines(first.slice(4)) };
    }
    if (lines.length === 1 && first.startsWith("## ")) {
      return { type: "h2", inlines: parseInlines(first.slice(3)) };
    }
    if (lines.every((line) => line.startsWith(">"))) {
      return {
        type: "quote",
        lines: lines.map((line) => parseInlines(line.replace(/^>\s?/, ""))),
      };
    }
    if (lines.every((line) => /^\d+\.\s/.test(line))) {
      return {
        type: "ol",
        items: lines.map((line) => parseInlines(line.replace(/^\d+\.\s/, ""))),
      };
    }
    if (lines.every((line) => line.startsWith("- "))) {
      return { type: "ul", items: lines.map((line) => parseInlines(line.slice(2))) };
    }
    const question = questionLine.exec(first);
    if (question?.[1]?.endsWith("?")) {
      return {
        type: "faq",
        question: question[1],
        lines: lines.slice(1).map((line) => parseInlines(line)),
      };
    }
    return { type: "p", lines: lines.map((line) => parseInlines(line)) };
  });
}

function inlineText(inlines: Inline[]) {
  return inlines
    .map((inline) => inline.text)
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

// FAQ answers for FAQPage JSON-LD. Link labels stay; the URLs do not.
export function faqsFromMarkdown(markdown: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  let current: { question: string; answer: string } | null = null;
  let inFaq = false;
  for (const block of parseBlogBlocks(markdown)) {
    if (block.type === "h2") {
      const heading = inlineText(block.inlines);
      if (heading === "FAQ") {
        inFaq = true;
        continue;
      }
      if (inFaq) break;
    }
    if (!inFaq) continue;
    if (block.type === "faq") {
      if (current) faqs.push(current);
      current = {
        question: block.question,
        answer: block.lines.map(inlineText).filter(Boolean).join(" "),
      };
      continue;
    }
    if (!current) continue;
    let extra = "";
    if (block.type === "p" || block.type === "quote") {
      extra = block.lines.map(inlineText).filter(Boolean).join(" ");
    } else if (block.type === "ul" || block.type === "ol") {
      extra = block.items.map(inlineText).filter(Boolean).join(" ");
    } else if (block.type === "h3") {
      extra = inlineText(block.inlines);
    }
    if (extra) current.answer = `${current.answer} ${extra}`.trim();
  }
  if (current) faqs.push(current);
  return faqs;
}

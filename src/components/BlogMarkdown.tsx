import { Link } from "@tanstack/react-router";
import { blogHref, parseBlogBlocks, type Inline } from "@/lib/blog-markdown";

const linkClass = "underline decoration-gold/60 underline-offset-2 hover:text-gold";

function InlineText({ inlines }: { inlines: Inline[] }) {
  return inlines.map((inline, index) => {
    if (inline.type === "strong") return <strong key={index}>{inline.text}</strong>;
    if (inline.type === "em") return <em key={index}>{inline.text}</em>;
    if (inline.type === "text") return <span key={index}>{inline.text}</span>;
    const href = blogHref(inline.href);
    if (href.kind === "blog") {
      return (
        <Link key={index} to="/blog/$slug" params={{ slug: href.slug }} className={linkClass}>
          {inline.text}
        </Link>
      );
    }
    if (href.kind === "podcast") {
      return (
        <Link key={index} to="/podcast" className={linkClass}>
          {inline.text}
        </Link>
      );
    }
    if (href.kind === "internal") {
      return (
        <a key={index} href={href.path} className={linkClass}>
          {inline.text}
        </a>
      );
    }
    return (
      <a
        key={index}
        href={href.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {inline.text}
      </a>
    );
  });
}

function Lines({ lines }: { lines: Inline[][] }) {
  return lines.map((line, index) => (
    <span key={index}>
      {index > 0 && <br />}
      <InlineText inlines={line} />
    </span>
  ));
}

export function BlogMarkdown({ body }: { body: string }) {
  const blocks = parseBlogBlocks(body);
  return (
    <div className="mt-8 space-y-5 text-lg leading-relaxed">
      {blocks.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h2 key={index} className="pt-4 text-3xl font-semibold">
              <InlineText inlines={block.inlines} />
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={index} className="pt-2 text-2xl font-semibold">
              <InlineText inlines={block.inlines} />
            </h3>
          );
        }
        if (block.type === "faq") {
          return (
            <div key={index}>
              <h3 className="text-xl font-semibold">{block.question}</h3>
              {block.lines.length > 0 && (
                <p className="mt-2">
                  <Lines lines={block.lines} />
                </p>
              )}
            </div>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={index}
              className="border-l-[3px] border-gold bg-secondary px-5 py-4 text-base"
            >
              {block.lines.map((line, lineIndex) => (
                <p
                  key={lineIndex}
                  className={lineIndex === 0 ? "italic" : "mt-2 not-italic text-muted-foreground"}
                >
                  <InlineText inlines={line} />
                </p>
              ))}
            </blockquote>
          );
        }
        if (block.type === "ul" || block.type === "ol") {
          const List = block.type === "ul" ? "ul" : "ol";
          const listClass =
            block.type === "ul" ? "list-disc space-y-2 pl-6" : "list-decimal space-y-2 pl-6";
          return (
            <List key={index} className={listClass}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <InlineText inlines={item} />
                </li>
              ))}
            </List>
          );
        }
        return (
          <p key={index}>
            <Lines lines={block.type === "p" ? block.lines : []} />
          </p>
        );
      })}
    </div>
  );
}

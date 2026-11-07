// Text with key words in gold. The words are marked in the translation file: "Latest *Posts*".
export function GoldText({ text }: { text: string }) {
  return (
    <>
      {text.split("*").map((part, i) =>
        i % 2 ? (
          <span key={i} className="text-gold">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

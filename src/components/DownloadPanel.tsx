import type { DocumentSpec } from "../data/site";

/**
 * Download panel for a task's final document.
 * Renders real files only; a pending document is stated as pending,
 * never as a dead link.
 */
export function DownloadPanel({
  doc,
  context = "page",
}: {
  doc: DocumentSpec;
  context?: "page" | "compact";
}) {
  const files: { href: string; label: string }[] = [];
  if (doc.docx) files.push({ href: `/documents/${doc.docx}`, label: "DOCX" });
  if (doc.pdf) files.push({ href: `/documents/${doc.pdf}`, label: "PDF" });

  if (files.length === 0) {
    return (
      <div className={`download is-pending context-${context}`}>
        <p className="download-label">{doc.label}</p>
        <p className="meta">
          Document pending: the group's final write-up will be available for
          download here as soon as it is supplied.
        </p>
      </div>
    );
  }

  return (
    <div className={`download context-${context}`}>
      <p className="download-label">{doc.label}</p>
      <div className="download-files">
        {files.map((f) => (
          <a
            key={f.label}
            className="action download-file"
            href={f.href}
            download
          >
            Download {f.label}
          </a>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { DocumentItem, DocStatus } from "@/lib/types";

const STATUS_ORDER: DocStatus[] = ["not_requested", "requested", "received", "expired"];

const STATUS_LABEL: Record<DocStatus, string> = {
  not_requested: "Not requested",
  requested: "Requested",
  received: "Received",
  expired: "Expired",
};

const STATUS_STYLE: Record<DocStatus, string> = {
  not_requested: "bg-white text-slate border-rule",
  requested: "bg-brassSoft text-brass border-brass",
  received: "bg-forestSoft text-forest border-forest",
  expired: "bg-rustSoft text-rust border-rust",
};

const COMMON_DOCS = [
  "Photo ID",
  "Proof of address",
  "Payslips",
  "P60s",
  "Bank statements",
  "Proof of deposit",
  "SA302 (self-employed)",
  "Buildings insurance",
];

export default function DocumentChecklist({
  documents,
  onChange,
}: {
  documents: DocumentItem[];
  onChange: (docs: DocumentItem[]) => void;
}) {
  const [customName, setCustomName] = useState("");
  const customInputRef = useRef<HTMLInputElement>(null);
  const [editingUrlFor, setEditingUrlFor] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const existingNames = new Set(documents.map((d) => d.name));

  function cycleStatus(name: string) {
    onChange(
      documents.map((d) =>
        d.name === name
          ? { ...d, status: STATUS_ORDER[(STATUS_ORDER.indexOf(d.status) + 1) % STATUS_ORDER.length] }
          : d
      )
    );
  }

  function addDoc(name: string) {
    if (!name.trim() || existingNames.has(name)) return;
    onChange([...documents, { name, status: "not_requested" }]);
    setCustomName("");
  }

  function removeDoc(name: string) {
    onChange(documents.filter((d) => d.name !== name));
  }

  function startEditingUrl(doc: DocumentItem) {
    setEditingUrlFor(doc.name);
    setUrlDraft(doc.url ?? "");
  }

  function saveUrl(name: string) {
    onChange(
      documents.map((d) => (d.name === name ? { ...d, url: urlDraft.trim() || undefined } : d))
    );
    setEditingUrlFor(null);
    setUrlDraft("");
  }

  function cancelEditingUrl() {
    setEditingUrlFor(null);
    setUrlDraft("");
  }

  return (
    <div>
      {documents.length > 0 && (
        <ul className="space-y-1.5 mb-4">
          {documents.map((doc) => (
            <li key={doc.name} className="border border-rule px-3 py-2">
              <div className="flex items-center justify-between">
                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-forest hover:text-forest/70 underline underline-offset-2"
                  >
                    {doc.name}
                  </a>
                ) : (
                  <span className="text-sm text-ink">{doc.name}</span>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => cycleStatus(doc.name)}
                    className={`text-xs border px-2 py-1 ${STATUS_STYLE[doc.status]}`}
                  >
                    {STATUS_LABEL[doc.status]}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEditingUrl(doc)}
                    aria-label={doc.url ? `Edit link for ${doc.name}` : `Add link for ${doc.name}`}
                    title={doc.url ? "Edit link" : "Add link"}
                    className={`text-xs px-1 ${doc.url ? "text-forest hover:text-forest/70" : "text-slate hover:text-ink"}`}
                  >
                    🔗
                  </button>
                  <button
                    type="button"
                    onClick={() => removeDoc(doc.name)}
                    aria-label={`Remove ${doc.name}`}
                    className="text-slate hover:text-rust text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {editingUrlFor === doc.name && (
                <div className="flex gap-2 mt-2">
                  <input
                    autoFocus
                    type="url"
                    value={urlDraft}
                    onChange={(e) => setUrlDraft(e.target.value)}
                    placeholder="https://…"
                    className="flex-1 border border-rule bg-white px-3 py-1.5 text-base outline-none focus:border-ink"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveUrl(doc.name);
                      }
                      if (e.key === "Escape") cancelEditingUrl();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => saveUrl(doc.name)}
                    className="border border-ink px-3 py-1.5 text-sm text-ink hover:bg-ink hover:text-paper"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditingUrl}
                    className="text-xs text-slate hover:text-ink px-1"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {COMMON_DOCS.filter((d) => !existingNames.has(d)).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => {
              setCustomName(d);
              customInputRef.current?.focus();
            }}
            className="text-xs border border-rule px-2 py-1 text-slate hover:border-ink hover:text-ink"
          >
            + {d}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          ref={customInputRef}
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Document name…"
          className="flex-1 border border-rule bg-white px-3 py-1.5 text-base outline-none focus:border-ink"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addDoc(customName);
            }
          }}
        />
        <button
          type="button"
          onClick={() => addDoc(customName)}
          className="border border-ink px-3 py-1.5 text-sm text-ink hover:bg-ink hover:text-paper"
        >
          Add
        </button>
      </div>
    </div>
  );
}

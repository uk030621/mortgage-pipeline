"use client";

import { useState } from "react";

const PROVIDERS = [
  { name: "OneDrive", url: "https://onedrive.live.com/" },
  { name: "Dropbox", url: "https://www.dropbox.com/home" },
  { name: "Google Drive", url: "https://drive.google.com/drive/my-drive" },
];

export default function DocumentsFolderPrompt({
  borrowerName,
}: {
  borrowerName: string;
}) {
  const [copiedFor, setCopiedFor] = useState<string | null>(null);

  async function handleClick(provider: { name: string; url: string }) {
    try {
      await navigator.clipboard.writeText(borrowerName);
      setCopiedFor(provider.name);
      setTimeout(() => {
        setCopiedFor((current) => (current === provider.name ? null : current));
      }, 2500);
    } catch {
      // Clipboard access can fail (older browser, permissions, non-HTTPS).
      // Nothing is actually lost — the name is still shown on screen below
      // for the broker to copy manually.
    }
    window.open(provider.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="border border-dashed border-rule px-4 py-3 mb-4">
      <p className="text-sm text-ink mb-1">No documents folder set up yet.</p>
      <p className="text-xs text-slate mb-3">
        Pick where you keep client files — we&apos;ll copy{" "}
        <span className="font-medium text-ink">&quot;{borrowerName}&quot;</span> to
        your clipboard and open that provider in a new tab. Once there,
        create a new folder (usually via a <strong>New</strong> or{" "}
        <strong>+</strong> button) and paste the name in.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.name}
            type="button"
            onClick={() => handleClick(provider)}
            className="text-xs border border-ink px-2.5 py-1.5 text-ink hover:bg-ink hover:text-paper"
          >
            {copiedFor === provider.name ? "Copied ✓" : provider.name}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate mt-3">
        OneDrive tip: look for the blue <strong>+ Create or upload</strong>{" "}
        button — if you don&apos;t see it, click <strong>My files</strong> in
        the sidebar first (it&apos;s hidden on some other views, like
        Recent).
      </p>
      <p className="text-xs text-slate mt-1">
        On a work or school Microsoft account, OneDrive may also open to
        the wrong account, or to your personal files instead of your
        organisation&apos;s — switch accounts there if needed.
      </p>
      <p className="text-xs text-slate mt-1">
        Once the folder&apos;s created, paste its shareable link back here
        via <span className="text-ink">Edit</span>.
      </p>
    </div>
  );
}

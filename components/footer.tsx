"use client";
import { Github } from "lucide-react";

export function Footer() {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA;
  const repoUrl = "https://github.com/Jacksery/nandscraft";
  const shortCommit = commit ? commit.slice(0, 8) : "unknown";
  return (
    <footer className="w-full py-4 text-right px-4 text-xs text-muted-foreground border-t mt-8">
      <span className="inline-flex items-center gap-1">
        <Github className="h-4 w-4 inline" />
        {commit ? (
          <a
            href={`${repoUrl}/commit/${commit}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            <code>{shortCommit}</code>
          </a>
        ) : (
          <code>unknown</code>
        )}
      </span>
    </footer>
  );
}

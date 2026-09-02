import { CREATOR_LINKS } from "./creatorLinks.data.js";

function SocialIcon({ name }) {
  if (name === "github") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.095-1.41-.135-.345-.72-1.41-1.23-1.695-1.02-.51-1.395-.885-1.395-1.785 0-.885.795-1.59 2.205-1.59 1.26 0 1.935.855 2.205 1.35 1.05 1.8 2.805 1.26 3.495.96.105-.75.42-1.26.765-1.545-2.67-.3-5.46-1.335-5.46-5.925 0-1.32.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.5 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A8.203 8.203 0 0 0 24 12c0-6.63-5.37-12-12-12Z"
        />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.537H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        />
      </svg>
    );
  }

  if (name === "portfolio") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9.5h16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15.5h6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      />
    </svg>
  );
}

export function CreatorLinks() {
  return (
    <nav className="rd-creator-links" aria-label="Creator links">
      {CREATOR_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="rd-creator-link"
        >
          <SocialIcon name={link.icon} />
          <span>{link.label}</span>
        </a>
      ))}
    </nav>
  );
}

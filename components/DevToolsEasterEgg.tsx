"use client";

import { useEffect } from "react";

export default function DevToolsEasterEgg() {
  useEffect(() => {
    const ascii = `
  ██████╗ ██████╗ ███████╗███╗   ██╗████████╗
  ██╔══██╗██╔══██╗██╔════╝████╗  ██║╚══██╔══╝
  ██████╔╝██████╔╝█████╗  ██╔██╗ ██║   ██║   
  ██╔══██╗██╔══██╗██╔══╝  ██║╚██╗██║   ██║   
  ██████╔╝██║  ██║███████╗██║ ╚████║   ██║   
  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝  `;

    const secretNode = `
  ┌─ SECRET NODE ────────────────────────────────┐
  │                                              │
  │   You've found the hidden layer.             │
  │   The site has a terminal too.               │
  │                                              │
  │   Look for the  ▶  icon, bottom-right.       │
  │   Open it and type:  secret                  │
  │                                              │
  └──────────────────────────────────────────────┘`;

    console.log(
      `%c${ascii}`,
      "color: #E84825; font-family: 'JetBrains Mono', monospace; font-size: 10px; line-height: 1.4; font-weight: bold;"
    );

    console.log(
      "%c  Hey, I see you opened DevTools. 👋",
      "color: #ffffff; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: bold;"
    );

    console.log(
      "%c  You clearly live in this environment. So do I.\n  This portfolio was built by a developer — for developers.",
      "color: #a0aec0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6;"
    );

    console.log(
      `%c${secretNode}`,
      "color: #E84825; font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.5;"
    );

    console.log(
      "%c  — Brent Schoenmakers  |  brentweb.be",
      "color: #4a5568; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-style: italic;"
    );
  }, []);

  return null;
}

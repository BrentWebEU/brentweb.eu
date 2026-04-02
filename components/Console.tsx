'use client';

import { useState, useRef, useEffect, memo, useCallback } from "react";
import { Terminal, X, Minimize2, Maximize2, Send } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

interface Command {
  name: string;
  category: "general" | "cybersecurity" | "navigation" | "info";
}

const commands: Command[] = [
  { name: "help", category: "general" },
  { name: "clear", category: "general" },
  { name: "whoami", category: "info" },
  { name: "about", category: "info" },
  { name: "skills", category: "info" },
  { name: "projects", category: "info" },
  { name: "contact", category: "info" },
  { name: "ls", category: "navigation" },
  { name: "cd", category: "navigation" },
  { name: "map", category: "navigation" },
  { name: "scan", category: "cybersecurity" },
  { name: "vulnerability", category: "cybersecurity" },
  { name: "headers", category: "cybersecurity" },
  { name: "network", category: "cybersecurity" },
  { name: "encrypt", category: "cybersecurity" },
  { name: "hash", category: "cybersecurity" },
  { name: "secret", category: "general" },
];

type TFunction = (key: string, params?: Record<string, string | number>) => string;

const executeCommand = (t: TFunction, cmd: string, args: string[]): string => {
  const command = cmd.toLowerCase().trim();

  switch (command) {
    case "help":
      return `${t('console.output.helpTitle')}

${t('console.output.helpCategoryGeneral')}:
  help              - ${t('console.commandDescriptions.help')}
  clear             - ${t('console.commandDescriptions.clear')}
  secret            - ${t('console.commandDescriptions.secret')}

${t('console.output.helpCategoryInfo')}:
  whoami            - ${t('console.commandDescriptions.whoami')}
  about             - ${t('console.commandDescriptions.about')}
  skills            - ${t('console.commandDescriptions.skills')}
  projects          - ${t('console.commandDescriptions.projects')}
  contact           - ${t('console.commandDescriptions.contact')}

${t('console.output.helpCategoryNavigation')}:
  ls                - ${t('console.commandDescriptions.ls')}
  cd <section>      - ${t('console.output.helpCdSection')}
  map               - ${t('console.commandDescriptions.map')}

${t('console.output.helpCategoryCybersecurity')}:
  scan              - ${t('console.commandDescriptions.scan')}
  vulnerability     - ${t('console.commandDescriptions.vulnerability')}
  headers           - ${t('console.commandDescriptions.headers')}
  network           - ${t('console.commandDescriptions.network')}
  encrypt <text>    - ${t('console.commandDescriptions.encrypt')}
  hash <text>       - ${t('console.commandDescriptions.hash')}

${t('console.output.helpFooter')}`;

    case "clear":
      return "";

    case "whoami":
      return t('console.output.whoami');

    case "about":
      return t('console.output.about');

    case "skills":
      return t('console.output.skills');

    case "projects":
      return t('console.output.projects');

    case "contact":
      return t('console.output.contact');

    case "ls":
      return t('console.output.ls');

    case "cd":
      if (args.length === 0) {
        return t('console.output.cdUsage');
      }
      const section = args[0].toLowerCase();
      const validSections = ["about", "experience", "services", "projects", "contact", "security"];
      if (validSections.includes(section)) {
        window.location.hash = section;
        return t('console.output.cdNavigating', { section });
      }
      return t('console.output.cdNotFound', { section });

    case "map":
      const sections = ["about", "experience", "services", "projects", "contact"];
      let discoveredCount = 0;
      sections.forEach((s) => {
        if (document.getElementById(s)) discoveredCount++;
      });
      const totalNodes = 6;
      const progress = Math.min(discoveredCount + 1, totalNodes);
      const progressPercent = Math.round((progress / totalNodes) * 100);

      try {
        const stored = localStorage.getItem("sectionViews");
        if (stored) {
          const parsed = JSON.parse(stored);
          discoveredCount = parsed.filter((s: { viewed: boolean }) => s.viewed).length;
        }
      } catch (e) {
      }

      return `${t('console.output.mapTitle')}

${t('console.output.mapNodesDiscovered', { current: Math.min(discoveredCount + 1, totalNodes), total: totalNodes })}
${t('console.output.mapProgress', { percent: progressPercent })}

${t('console.output.mapAvailableNodes')}
  ${t('console.output.mapHeroNode')}
  [${sections.includes("about") && document.getElementById("about") ? "✓" : " "}] about
  [${sections.includes("experience") && document.getElementById("experience") ? "✓" : " "}] experience
  [${sections.includes("services") && document.getElementById("services") ? "✓" : " "}] services
  [${sections.includes("projects") && document.getElementById("projects") ? "✓" : " "}] projects
  [${sections.includes("contact") && document.getElementById("contact") ? "✓" : " "}] contact

${t('console.output.mapKeepExploring')}`;

    case "secret":
      return t('console.output.secret');

    case "scan":
      return `${t('console.output.scanTitle')}

${t('console.output.scanItems')}

${t('console.output.scanCompleted', { time: new Date().toLocaleTimeString() })}
${t('console.output.scanStatus')}`;

    case "vulnerability":
      return `${t('console.output.vulnerabilityTitle')}

${t('console.output.vulnerabilityChecking')}
${t('console.output.vulnerabilityItems')}

${t('console.output.vulnerabilityClean')}
${t('console.output.vulnerabilityLastUpdated', { date: new Date().toLocaleDateString() })}`;

    case "headers":
      return `${t('console.output.headersTitle')}

${t('console.output.headersItems')}

${t('console.output.headersAllConfigured')}`;

    case "network":
      return `${t('console.output.networkTitle')}

${t('console.output.networkInfo')}

${t('console.output.networkRequestHeaders')}
${t('console.output.networkUserAgent', { userAgent: navigator.userAgent })}
${t('console.output.networkAccept')}
${t('console.output.networkAcceptLanguage', { language: navigator.language })}`;

    case "encrypt":
      if (args.length === 0) {
        return t('console.output.encryptUsage');
      }
      const text = args.join(" ");
      const encrypted = btoa(text).split("").reverse().join("");
      return t('console.output.encryptResult', { result: encrypted });

    case "hash":
      if (args.length === 0) {
        return t('console.output.hashUsage');
      }
      const hashText = args.join(" ");
      let hash = 0;
      for (let i = 0; i < hashText.length; i++) {
        const char = hashText.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return t('console.output.hashResult', { result: Math.abs(hash).toString(16) });

    default:
      return t('console.commandNotFound', { cmd: command });
  }
};

export const Console = memo(() => {
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [history, setHistory] = useState<string[]>(() => [
    t('console.welcome'),
    t('console.welcomeHint'),
    "",
  ]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized && !isMobile) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized, isMobile]);

  useEffect(() => {
    if (!isOpen || isMinimized) return;
    const vv = window.visualViewport;
    if (!vv) return;
    vv.addEventListener("resize", scrollToBottom);
    return () => vv.removeEventListener("resize", scrollToBottom);
  }, [isOpen, isMinimized, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = commands
      .filter((cmd) => cmd.name.startsWith(value.toLowerCase()))
      .map((cmd) => cmd.name)
      .slice(0, 5);
    setSuggestions(filtered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parts = input.trim().split(" ");
    const command = parts[0];
    const args = parts.slice(1);

    const newHistory = [...history, `$ ${input}`];
    const output = executeCommand(t, command, args);

    if (output === "") {
      setHistory([""]);
    } else {
      setHistory([...newHistory, output, ""]);
    }

    setInput("");
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      setInput(suggestions[0]);
      setSuggestions([]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="console-toggle"
        aria-label={t('console.openConsole')}
      >
        <Terminal className="console-toggle-icon" />
      </button>
    );
  }

  return (
    <div
      className={`console ${isMinimized ? "console--minimized" : "console--expanded"}`}
    >
      <div className="console__header">
        <div className="console__header-left">
          <Terminal className="console__header-icon" />
          <span className="console__header-title">console</span>
          <span className="console__header-version">v1.0.0</span>
        </div>
        <div className="console__header-actions">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="console__header-button"
            aria-label={isMinimized ? t('console.maximize') : t('console.minimize')}
          >
            {isMinimized ? (
              <Maximize2 className="console__header-button-icon" />
            ) : (
              <Minimize2 className="console__header-button-icon" />
            )}
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setIsMinimized(false);
            }}
            className="console__header-button"
            aria-label={t('console.closeConsole')}
          >
            <X className="console__header-button-icon" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="console__output">
            {history.map((line, index) => (
              <div key={index} className="console__output-line">
                {line === "" ? (
                  <br />
                ) : (
                  <pre className="console__output-pre">
                    {line}
                  </pre>
                )}
              </div>
            ))}
            <div ref={historyEndRef} />
          </div>

          <div className="console__input-area">
            <form onSubmit={handleSubmit} className="console__input-form">
              <div className="console__input-wrapper">
                <span className="console__input-prompt">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="console__input-field"
                  placeholder={t('console.inputPlaceholder')}
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="send"
                />
                <button
                  type="submit"
                  className="console__input-send"
                  aria-label="Run command"
                >
                  <Send className="console__input-send-icon" />
                </button>
              </div>

              {suggestions.length > 0 && (
                <div className="console__input-suggestions">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="console__input-suggestion"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </form>
            <p className="console__input-hint">
              {t('console.inputHint')}
            </p>
          </div>
        </>
      )}
    </div>
  );
});

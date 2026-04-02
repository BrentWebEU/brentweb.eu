'use client';

import { useState } from "react";
import { Menu, X } from "lucide-react";
const logo = "/logo.svg";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { RollingLink } from "./RollingLink";
import { useTranslations } from "@/hooks/useTranslations";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslations();

  const navLinks = [
    { name: t('nav.about'), href: "#about" },
    { name: t('nav.experience'), href: "#experience" },
    { name: t('nav.services'), href: "#services" },
    { name: t('nav.projects'), href: "#projects" },
    { name: t('nav.blog'), href: "https://blog.brentweb.eu/" },
    { name: t('nav.contact'), href: "#contact" },
  ];

  return (
    <>
      <nav className="nav">
        <div className="nav__container">
          <a 
            href="#hero" 
            className="nav__logo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src={logo}
              alt="Brent Schoenmakers"
              className="nav__logo-img"
            />
          </a>

          <div className="nav__links">
            {navLinks.map((link) => (
              <RollingLink
                key={link.name}
                href={link.href}
                className="nav__link"
              >
                {link.name}
              </RollingLink>
            ))}
          </div>

          <div className="nav__right">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="nav__mobile-toggle"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="nav__mobile-icon" />
            ) : (
              <Menu className="nav__mobile-icon" />
            )}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="nav__mobile-menu">
          <div className="nav__mobile-content">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="nav__mobile-link"
              >
                {link.name}
              </a>
            ))}
            <div className="nav__mobile-actions">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

const LINKS = [
  { href: "#advantages", label: "Преимущества" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#faq", label: "Вопросы" },
  { href: "#lead", label: "Заявка" },
];

export default function Header({ onOpenAssistant }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Logo />

        <nav className={`${styles.nav} ${open ? styles.navOpen : ""}`}>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            className={styles.navAssist}
            onClick={() => {
              setOpen(false);
              onOpenAssistant?.();
            }}
          >
            Помощник
          </button>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <a href="#lead" className={`btn btn-primary ${styles.cta}`}>
            Оставить заявку
          </a>
          <button
            type="button"
            className={styles.burger}
            aria-label="Меню"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

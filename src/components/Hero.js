"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import ParallaxRings from "./ParallaxRings";
import Reveal from "./Reveal";
import styles from "./Hero.module.css";

const SCRIPT = [
  { role: "user", text: "Сколько времени занимает запуск?" },
  {
    role: "assistant",
    text: "Обычно 5–14 дней: изучаем нишу, собираем сценарий и подключаем заявки к вам.",
  },
  {
    role: "assistant",
    text: "Могу за минуту подобрать формат — ответьте на пару вопросов.",
  },
];

function useTypedDialog(enabled) {
  const [visible, setVisible] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setVisible(SCRIPT);
      return undefined;
    }

    let cancelled = false;
    let timer;

    const run = async () => {
      setVisible([]);
      for (let i = 0; i < SCRIPT.length; i += 1) {
        if (cancelled) return;
        setTyping(SCRIPT[i].role === "assistant");
        await new Promise((resolve) => {
          timer = setTimeout(resolve, SCRIPT[i].role === "user" ? 700 : 1100);
        });
        if (cancelled) return;
        setTyping(false);
        setVisible((current) => [...current, SCRIPT[i]]);
        await new Promise((resolve) => {
          timer = setTimeout(resolve, 450);
        });
      }
    };

    run();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [enabled]);

  return { visible, typing };
}

export default function Hero({ onOpenAssistant }) {
  const reduceMotion = useReducedMotion();
  const { visible, typing } = useTypedDialog(!reduceMotion);

  return (
    <section className={styles.hero} id="top">
      <ParallaxRings />
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.copy}>
          <p className={styles.brand}>Мох</p>
          <h1>ИИ-помощник, который отвечает клиентам и собирает заявки</h1>
          <p className={styles.lead}>
            Ставим компаниям спокойных ассистентов на сайт и в мессенджеры —
            они закрывают вопросы и мягко доводят диалог до контакта.
          </p>
          <div className={styles.actions}>
            <a href="#lead" className="btn btn-primary">
              Оставить заявку
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onOpenAssistant}
            >
              Подобрать решение
            </button>
          </div>
        </Reveal>

        <Reveal className={styles.preview} delay={0.14}>
          <div className={styles.previewGlow} aria-hidden="true" />
          <div className={`card ${styles.previewCard}`}>
            <div className={styles.previewHead}>
              <span className={styles.avatar} aria-hidden="true">
                <span className={styles.pulse} />
              </span>
              <div>
                <strong>Помощник Мох</strong>
                <p>
                  <span className={styles.live} /> онлайн · демо-диалог
                </p>
              </div>
            </div>

            <div className={styles.messages} aria-live="polite">
              <AnimatePresence initial={false}>
                {visible.map((item, index) => (
                  <motion.div
                    key={`${item.role}-${index}`}
                    className={`${styles.bubble} ${
                      item.role === "user" ? styles.user : styles.bot
                    }`}
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, y: 12, scale: 0.98 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {item.text}
                  </motion.div>
                ))}
              </AnimatePresence>

              {typing && (
                <div className={`${styles.bubble} ${styles.bot} ${styles.typing}`}>
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>

            <button
              type="button"
              className={`btn btn-primary ${styles.previewCta}`}
              onClick={onOpenAssistant}
            >
              Начать подбор с ИИ
            </button>
          </div>
        </Reveal>
      </div>

      <div className={styles.rail} aria-hidden="true">
        <div className={`container ${styles.railInner}`}>
          <span>отвечает 24/7</span>
          <span>запуск за 5–14 дней</span>
          <span>заявки в Telegram</span>
        </div>
      </div>
    </section>
  );
}

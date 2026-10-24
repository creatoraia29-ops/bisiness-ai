"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import Reveal from "./Reveal";
import styles from "./FAQ.module.css";

const ITEMS = [
  {
    q: "Что именно вы внедряете?",
    a: "ИИ-помощника на сайт или в мессенджер: он отвечает по вашей услуге, уточняет задачу и собирает заявку.",
  },
  {
    q: "Сколько длится запуск?",
    a: "Типовой проект занимает от 5 до 14 дней: бриф, сценарий, настройка и передача заявок в админку и Telegram.",
  },
  {
    q: "Нужен ли свой разработчик?",
    a: "Нет. Мы берём внедрение на себя и подключаем помощника к вашим каналам приёма заявок.",
  },
  {
    q: "Можно ли обучить помощника на наших текстах?",
    a: "Да. Берём ваши FAQ, прайс, условия и тон общения, чтобы ответы звучали как от вашей команды.",
  },
  {
    q: "Куда приходят заявки?",
    a: "В веб-админку по адресу /admin и дублем в Telegram через бота в ваш чат или группу.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <section className="section" id="faq">
      <div className={`container ${styles.layout}`}>
        <Reveal className={styles.side}>
          <h2 className="section-title">Частые вопросы</h2>
          <p className="section-lead">
            Коротко о запуске, обучении помощника и маршруте заявок.
          </p>
          <button
            type="button"
            className={`btn btn-ghost ${styles.sideBtn}`}
            onClick={() =>
              document.getElementById("lead")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Остались вопросы — напишите
          </button>
        </Reveal>

        <div className={styles.list}>
          {ITEMS.map((item, index) => {
            const isOpen = open === index;
            return (
              <Reveal key={item.q} delay={index * 0.04} className={styles.item}>
                <button
                  type="button"
                  className={`${styles.trigger} ${isOpen ? styles.open : ""}`}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                >
                  <span>{item.q}</span>
                  <span className={styles.icon} aria-hidden="true">
                    <i />
                    <i />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={
                        reduceMotion ? false : { height: 0, opacity: 0 }
                      }
                      animate={{ height: "auto", opacity: 1 }}
                      exit={
                        reduceMotion
                          ? undefined
                          : { height: 0, opacity: 0 }
                      }
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className={styles.answerWrap}
                    >
                      <p className={styles.answer}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

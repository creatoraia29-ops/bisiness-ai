"use client";

import Reveal from "./Reveal";
import styles from "./Advantages.module.css";

const ITEMS = [
  {
    title: "Ответ за секунды",
    text: "Помощник закрывает типовые вопросы сразу, пока менеджер занят или вне смены.",
    wide: true,
  },
  {
    title: "Доведение до заявки",
    text: "Мягко уточняет задачу, собирает имя и телефон и передаёт тёплый контакт вам.",
  },
  {
    title: "Под вашу нишу",
    text: "Сценарий пишем под клинику, школу, сервис или продажи — без универсальных шаблонов.",
  },
  {
    title: "Заявки сразу у вас",
    text: "Каждый лид сохраняется в админке и дублируется ботом в Telegram.",
  },
];

export default function Advantages() {
  return (
    <section className={`section ${styles.section}`} id="advantages">
      <div className="container">
        <Reveal className={styles.intro}>
          <h2 className="section-title">Почему бизнесы выбирают Мох</h2>
          <p className="section-lead">
            Не чат ради чата — а помощник, который работает как спокойный
            администратор на линии.
          </p>
        </Reveal>

        <div className={styles.bento}>
          {ITEMS.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 0.07}
              className={`${styles.tile} ${item.wide ? styles.wide : ""}`}
            >
              <div className={styles.mark} aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <path
                    d="M10 34c3-10 8-17 14-20 6 3 11 10 14 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="24" cy="14" r="2.5" fill="currentColor" />
                </svg>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

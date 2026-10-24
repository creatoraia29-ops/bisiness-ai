"use client";

import Reveal from "./Reveal";
import styles from "./Testimonials.module.css";

const REVIEWS = [
  {
    name: "Анна К.",
    role: "Клиника эстетики",
    result: "Ночные заявки больше не теряются",
    text: "Помощник закрывает вопросы по услугам и записывает на консультацию. Утром уже видим контакты в Telegram.",
  },
  {
    name: "Игорь М.",
    role: "Онлайн-школа",
    result: "Меньше одинаковых ответов менеджерам",
    text: "ИИ собирает интерес и передаёт только тех, кто готов обсудить обучение. Вечера команды стали спокойнее.",
  },
  {
    name: "Елена В.",
    role: "Сервис ремонта",
    result: "Запуск за неделю",
    text: "Клиенты пишут в любое время, а мы получаем готовые заявки с адресом и типом работ.",
  },
];

export default function Testimonials() {
  return (
    <section className={`section ${styles.section}`} id="reviews">
      <div className={styles.backdrop} aria-hidden="true" />
      <div className="container">
        <Reveal className={styles.intro}>
          <h2 className="section-title">Как это звучит у клиентов</h2>
          <p className="section-lead">
            Конкретные сценарии из клиник, школ и сервисных компаний.
          </p>
        </Reveal>

        <div className={styles.grid}>
          {REVIEWS.map((review, index) => (
            <Reveal
              key={review.name}
              delay={index * 0.08}
              className={`${styles.card} ${styles[`shift${index}`] ?? ""}`}
            >
              <p className={styles.result}>{review.result}</p>
              <p className={styles.text}>{review.text}</p>
              <div className={styles.meta}>
                <span className={styles.avatar} aria-hidden="true">
                  {review.name.slice(0, 1)}
                </span>
                <div>
                  <strong>{review.name}</strong>
                  <span>{review.role}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

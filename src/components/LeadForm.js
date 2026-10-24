"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import styles from "./LeadForm.module.css";

const INITIAL = {
  name: "",
  phone: "",
  company: "",
  message: "",
};

export default function LeadForm() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "form" }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Не удалось отправить заявку");
      }

      setForm(INITIAL);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    }
  };

  return (
    <section className={`section ${styles.section}`} id="lead">
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.copy}>
          <h2 className="section-title">Оставьте заявку</h2>
          <p className="section-lead">
            Расскажите о бизнесе — вернёмся с коротким планом внедрения
            ИИ-помощника и сбора заявок.
          </p>
          <ul className={styles.points}>
            <li>Ответ в рабочий день</li>
            <li>Без сложных ТЗ на старте</li>
            <li>Можно начать с квиза у помощника</li>
          </ul>
        </Reveal>

        <Reveal delay={0.1} className={styles.formShell}>
          <div className={styles.glow} aria-hidden="true" />
          <div className={`card ${styles.formCard}`}>
            <p className={styles.formTitle}>Короткий бриф</p>
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.row}>
                <div className="field">
                  <label htmlFor="name">Имя</label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Как к вам обращаться"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="phone">Телефон</label>
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="+998 ..."
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="company">Компания</label>
                <input
                  id="company"
                  name="company"
                  value={form.company}
                  onChange={onChange}
                  placeholder="Название или ниша"
                />
              </div>

              <div className="field">
                <label htmlFor="message">Задача</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  placeholder="Где нужны ответы клиентам и заявки"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Отправляем..." : "Отправить заявку"}
              </button>

              {status === "success" && (
                <p className={styles.success}>
                  Заявка принята. Мы свяжемся с вами в ближайшее время.
                </p>
              )}
              {status === "error" && <p className={styles.error}>{error}</p>}
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

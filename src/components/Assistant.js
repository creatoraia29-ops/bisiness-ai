"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Assistant.module.css";

const QUIZ_STEPS = [
  {
    key: "niche",
    question: "В какой нише ваш бизнес?",
    options: ["Клиника / услуги", "Образование", "Сервис / ремонт", "Продажи / e‑com", "Другое"],
  },
  {
    key: "goal",
    question: "Что хотите автоматизировать?",
    options: [
      "Ответы на типовые вопросы",
      "Запись и заявки",
      "Квалификация лидов",
      "Всё сразу",
    ],
  },
  {
    key: "timing",
    question: "Когда планируете запуск?",
    options: ["Как можно скорее", "В течение месяца", "Просто изучаю"],
  },
];

const WELCOME =
  "Здравствуйте! Я помощник студии «Мох». Расскажу про внедрение ИИ для заявок или подберу решение в коротком квизе.";

export default function Assistant({ open, onOpenChange }) {
  const [mode, setMode] = useState("chat");
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestLead, setSuggestLead] = useState(false);

  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizContact, setQuizContact] = useState({ name: "", phone: "" });
  const [quizStatus, setQuizStatus] = useState("idle");
  const [quizError, setQuizError] = useState("");

  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open, loading]);

  const sendChat = async (text) => {
    const content = text.trim();
    if (!content || loading) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Не удалось получить ответ");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply },
      ]);
      setSuggestLead(Boolean(data.suggestLead));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка чата");
    } finally {
      setLoading(false);
    }
  };

  const onChatSubmit = (event) => {
    event.preventDefault();
    sendChat(input);
  };

  const chooseQuizOption = (option) => {
    const step = QUIZ_STEPS[quizStep];
    const nextAnswers = { ...quizAnswers, [step.key]: option };
    setQuizAnswers(nextAnswers);
    setQuizStep((value) => value + 1);
  };

  const submitQuiz = async (event) => {
    event.preventDefault();
    setQuizStatus("loading");
    setQuizError("");

    const message = [
      `Ниша: ${quizAnswers.niche || "—"}`,
      `Задача: ${quizAnswers.goal || "—"}`,
      `Срок: ${quizAnswers.timing || "—"}`,
      "Источник: квиз помощника",
    ].join("\n");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: quizContact.name,
          phone: quizContact.phone,
          company: quizAnswers.niche || "",
          message,
          source: "quiz",
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Не удалось отправить заявку");
      }
      setQuizStatus("success");
    } catch (err) {
      setQuizStatus("error");
      setQuizError(err instanceof Error ? err.message : "Ошибка отправки");
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
    setQuizContact({ name: "", phone: "" });
    setQuizStatus("idle");
    setQuizError("");
  };

  return (
    <>
      <button
        type="button"
        className={styles.fab}
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
      >
        <span className={styles.fabDot} />
        {open ? "Закрыть" : "ИИ-помощник"}
      </button>

      {open && (
        <aside className={`card ${styles.panel}`} aria-label="ИИ-помощник">
          <div className={styles.head}>
            <div>
              <strong>Помощник Мох</strong>
              <p>Ответы по услуге и мягкий подбор</p>
            </div>
            <button
              type="button"
              className={styles.close}
              onClick={() => onOpenChange(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>

          <div className={styles.modes}>
            <button
              type="button"
              className={mode === "chat" ? styles.active : ""}
              onClick={() => setMode("chat")}
            >
              Чат
            </button>
            <button
              type="button"
              className={mode === "quiz" ? styles.active : ""}
              onClick={() => {
                setMode("quiz");
                if (quizStatus === "success") resetQuiz();
              }}
            >
              Квиз
            </button>
          </div>

          {mode === "chat" ? (
            <>
              <div className={styles.messages} ref={listRef}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`${styles.bubble} ${
                      message.role === "user" ? styles.user : styles.bot
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
                {loading && (
                  <div className={`${styles.bubble} ${styles.bot}`}>
                    Печатаю ответ...
                  </div>
                )}
              </div>

              {suggestLead && (
                <div className={styles.nudge}>
                  <p>Готовы обсудить внедрение?</p>
                  <div className={styles.nudgeActions}>
                    <a href="#lead" className="btn btn-primary" onClick={() => onOpenChange(false)}>
                      К форме
                    </a>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setMode("quiz")}
                    >
                      Пройти квиз
                    </button>
                  </div>
                </div>
              )}

              {error && <p className={styles.error}>{error}</p>}

              <form className={styles.composer} onSubmit={onChatSubmit}>
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Спросите про сроки, нишу, заявки..."
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !input.trim()}
                >
                  Отправить
                </button>
              </form>
            </>
          ) : (
            <div className={styles.quiz}>
              {quizStatus === "success" ? (
                <div className={styles.quizDone}>
                  <h3>Заявка отправлена</h3>
                  <p>
                    Спасибо! Мы получили ответы квиза и свяжемся с вами для
                    короткого плана внедрения.
                  </p>
                  <button type="button" className="btn btn-ghost" onClick={resetQuiz}>
                    Пройти ещё раз
                  </button>
                </div>
              ) : quizStep < QUIZ_STEPS.length ? (
                <>
                  <p className={styles.quizProgress}>
                    Шаг {quizStep + 1} из {QUIZ_STEPS.length + 1}
                  </p>
                  <h3>{QUIZ_STEPS[quizStep].question}</h3>
                  <div className={styles.options}>
                    {QUIZ_STEPS[quizStep].options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => chooseQuizOption(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <form className={styles.quizForm} onSubmit={submitQuiz}>
                  <p className={styles.quizProgress}>
                    Шаг {QUIZ_STEPS.length + 1} из {QUIZ_STEPS.length + 1}
                  </p>
                  <h3>Куда отправить подбор?</h3>
                  <div className="field">
                    <label htmlFor="quiz-name">Имя</label>
                    <input
                      id="quiz-name"
                      value={quizContact.name}
                      onChange={(event) =>
                        setQuizContact((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="quiz-phone">Телефон</label>
                    <input
                      id="quiz-phone"
                      value={quizContact.phone}
                      onChange={(event) =>
                        setQuizContact((current) => ({
                          ...current,
                          phone: event.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  {quizError && <p className={styles.error}>{quizError}</p>}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={quizStatus === "loading"}
                  >
                    {quizStatus === "loading" ? "Отправляем..." : "Получить подбор"}
                  </button>
                </form>
              )}
            </div>
          )}
        </aside>
      )}
    </>
  );
}

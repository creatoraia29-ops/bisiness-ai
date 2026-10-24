"use client";

import { useCallback, useEffect, useState } from "react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./admin.module.css";

const SOURCE_LABEL = {
  form: "Форма",
  quiz: "Квиз",
  chat: "Чат",
};

const STATUS_LABEL = {
  new: "Новая",
  in_progress: "В работе",
};

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/leads");
      if (response.status === 401) {
        setAuthed(false);
        setChecking(false);
        return;
      }
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Не удалось загрузить заявки");
      }
      setLeads(data.leads || []);
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const onLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Неверный пароль");
      }
      setPassword("");
      await loadLeads();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Ошибка входа");
    }
  };

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setLeads([]);
  };

  const updateStatus = async (id, status) => {
    const response = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await response.json();
    if (response.ok && data.ok) {
      setLeads((current) =>
        current.map((lead) => (lead.id === id ? data.lead : lead))
      );
    }
  };

  if (checking) {
    return (
      <div className={styles.shell}>
        <p className={styles.muted}>Проверяем доступ...</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className={styles.shell}>
        <form className={`card ${styles.login}`} onSubmit={onLogin}>
          <Logo compact />
          <h1>Админ-панель</h1>
          <p className={styles.muted}>Вход для просмотра заявок Мох</p>
          <div className="field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {loginError && <p className={styles.error}>{loginError}</p>}
          <button type="submit" className="btn btn-primary">
            Войти
          </button>
          <a href="/" className={styles.back}>
            На сайт
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Logo compact />
          <div className={styles.actions}>
            <ThemeToggle />
            <button type="button" className="btn btn-ghost" onClick={loadLeads}>
              Обновить
            </button>
            <button type="button" className="btn btn-ghost" onClick={onLogout}>
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className={`container ${styles.main}`}>
        <div className={styles.titleRow}>
          <div>
            <h1>Заявки</h1>
            <p className={styles.muted}>
              Всего: {leads.length}
              {loading ? " · обновляем..." : ""}
            </p>
          </div>
          <a href="/" className={styles.back}>
            ← На сайт
          </a>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {!leads.length ? (
          <div className={`card ${styles.empty}`}>
            Заявок пока нет. Отправьте тестовую форму на главной.
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Имя</th>
                  <th>Телефон</th>
                  <th>Источник</th>
                  <th>Сообщение</th>
                  <th>Статус</th>
                  <th>Telegram</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{formatDate(lead.createdAt)}</td>
                    <td>
                      <strong>{lead.name}</strong>
                      {lead.company ? (
                        <div className={styles.muted}>{lead.company}</div>
                      ) : null}
                    </td>
                    <td>
                      <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                    </td>
                    <td>{SOURCE_LABEL[lead.source] || lead.source}</td>
                    <td className={styles.message}>{lead.message || "—"}</td>
                    <td>
                      <select
                        value={lead.status}
                        onChange={(event) =>
                          updateStatus(lead.id, event.target.value)
                        }
                      >
                        <option value="new">{STATUS_LABEL.new}</option>
                        <option value="in_progress">
                          {STATUS_LABEL.in_progress}
                        </option>
                      </select>
                    </td>
                    <td>
                      {lead.telegramSent ? (
                        <span className={styles.ok}>отправлено</span>
                      ) : (
                        <span className={styles.warn} title={lead.telegramError || ""}>
                          не доставлено
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

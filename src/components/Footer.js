import Logo from "./Logo";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <Logo compact />
        <p className={styles.copy}>
          © 2026 Мох — ИИ-помощники для сбора заявок
        </p>
        <a href="/admin" className={styles.admin}>
          Админ-панель
        </a>
      </div>
    </footer>
  );
}

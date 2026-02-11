import styles from './EmptyState.module.css'

export default function EmptyState({ message, description }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>📋</div>
      <p className={styles.message}>{message}</p>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}

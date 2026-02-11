import styles from './ErrorState.module.css'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>⚠️</div>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

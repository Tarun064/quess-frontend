import { Outlet } from 'react-router-dom'
import NavLink from './NavLink'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.logo}>HRMS Lite</h1>
          <nav className={styles.nav}>
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/employees">Employees</NavLink>
            <NavLink to="/attendance">Attendance</NavLink>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        {children || <Outlet />}
      </main>
    </div>
  )
}

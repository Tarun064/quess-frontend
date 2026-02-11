import { NavLink as RouterNavLink } from 'react-router-dom'

export default function NavLink({ to, end, children }) {
  return (
    <RouterNavLink to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>
      {children}
    </RouterNavLink>
  )
}

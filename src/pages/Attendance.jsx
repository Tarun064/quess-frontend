import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import styles from './Attendance.module.css'

export default function Attendance() {
  const [employees, setEmployees] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    employee_id: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'Present',
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [filterEmployee, setFilterEmployee] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [summary, setSummary] = useState(null)

  const fetchEmployees = useCallback(async () => {
    try {
      const data = await api.get('/api/employees')
      setEmployees(data)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const fetchAttendance = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let path = '/api/attendance?'
      if (filterEmployee) path += `employee_id=${encodeURIComponent(filterEmployee)}&`
      if (filterFrom) path += `from_date=${filterFrom}&`
      if (filterTo) path += `to_date=${filterTo}&`
      const data = await api.get(path.replace(/\?$/, '').replace(/&$/, ''))
      setRecords(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filterEmployee, filterFrom, filterTo])

  const fetchSummary = useCallback(async () => {
    if (!filterEmployee) {
      setSummary(null)
      return
    }
    try {
      const data = await api.get(`/api/attendance/summary/${encodeURIComponent(filterEmployee)}`)
      setSummary(data)
    } catch {
      setSummary(null)
    }
  }, [filterEmployee])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  useEffect(() => {
    fetchAttendance()
  }, [fetchAttendance])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.employee_id) {
      setFormError('Please select an employee.')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/api/attendance', {
        employee_id: form.employee_id,
        date: form.date,
        status: form.status,
      })
      setForm((f) => ({ ...f, date: new Date().toISOString().slice(0, 10), status: 'Present' }))
      await fetchAttendance()
      if (form.employee_id === filterEmployee) await fetchSummary()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (error && employees.length === 0) return <ErrorState message={error} onRetry={fetchEmployees} />

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Attendance</h2>
        <p className={styles.subtitle}>Mark and view daily attendance.</p>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Mark attendance</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor="emp">Employee *</label>
              <select
                id="emp"
                value={form.employee_id}
                onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value }))}
                required
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.employee_id}>
                    {emp.full_name} ({emp.employee_id})
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="date">Date *</label>
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>
          {formError && <p className={styles.formError}>{formError}</p>}
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Saving…' : 'Save attendance'}
          </button>
        </form>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Attendance records</h3>
        <div className={styles.filters}>
          <div className={styles.filterRow}>
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className={styles.select}
            >
              <option value="">All employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
            <input
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              placeholder="From date"
              className={styles.dateInput}
            />
            <input
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              placeholder="To date"
              className={styles.dateInput}
            />
          </div>
        </div>
        {summary && (
          <div className={styles.summary}>
            <span>Total present: <strong>{summary.total_present_days}</strong></span>
            <span>Total absent: <strong>{summary.total_absent_days}</strong></span>
          </div>
        )}
        {loading ? (
          <Loading />
        ) : records.length === 0 ? (
          <EmptyState
            message="No attendance records"
            description={
              filterEmployee || filterFrom || filterTo
                ? 'Try changing filters or mark attendance above.'
                : 'Mark attendance using the form above.'
            }
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td>{r.employee_id}</td>
                    <td>{r.date}</td>
                    <td>
                      <span className={r.status === 'Present' ? styles.badgePresent : styles.badgeAbsent}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

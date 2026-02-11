import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import styles from './Employees.module.css'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get('/api/employees')
      setEmployees(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.employee_id.trim() || !form.full_name.trim() || !form.email.trim() || !form.department.trim()) {
      setFormError('All fields are required.')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/api/employees', form)
      setForm({ employee_id: '', full_name: '', email: '', department: '' })
      await fetchEmployees()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Delete this employee? This will also remove their attendance records.')) return
    setDeletingId(employeeId)
    try {
      await api.delete(`/api/employees/${employeeId}`)
      await fetchEmployees()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorState message={error} onRetry={fetchEmployees} />

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Employees</h2>
        <p className={styles.subtitle}>Add and manage employee records.</p>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Add employee</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor="employee_id">Employee ID *</label>
              <input
                id="employee_id"
                value={form.employee_id}
                onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value }))}
                placeholder="e.g. EMP001"
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="full_name">Full Name *</label>
              <input
                id="full_name"
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                placeholder="John Doe"
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="john@company.com"
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="department">Department *</label>
              <input
                id="department"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                placeholder="e.g. Engineering"
                required
              />
            </div>
          </div>
          {formError && <p className={styles.formError}>{formError}</p>}
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Adding…' : 'Add employee'}
          </button>
        </form>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>All employees</h3>
        {employees.length === 0 ? (
          <EmptyState
            message="No employees yet"
            description="Add an employee using the form above."
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.employee_id}</td>
                    <td>{emp.full_name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(emp.employee_id)}
                        disabled={deletingId === emp.employee_id}
                      >
                        {deletingId === emp.employee_id ? 'Deleting…' : 'Delete'}
                      </button>
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

import { useState, useEffect } from 'react'
import { api } from '../api/client'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'
import styles from './Dashboard.module.css'

export default function Dashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchStats = async () => {
        setLoading(true)
        setError(null)
        try {
            const stats = await api.get('/api/dashboard/summary')
            setData(stats)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    if (loading) return <Loading />
    if (error) return <ErrorState message={error} onRetry={fetchStats} />

    const stats = [
        { label: 'Total Employees', value: data.total_employees, color: '#3b82f6' },
        { label: "Today's Present", value: data.today_stats.present, color: '#8b5cf6' },
        { label: "Today's Absent", value: data.today_stats.absent, color: '#ef4444' },
    ]

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2 className={styles.title}>Dashboard</h2>
                <p className={styles.subtitle}>Overview of your HR metrics for {data.today_stats.date}.</p>
            </div>

            <div className={styles.statGrid}>
                {stats.map((s, i) => (
                    <div key={i} className={styles.statCard} style={{ borderColor: s.color }}>
                        <span className={styles.statLabel}>{s.label}</span>
                        <span className={styles.statValue} style={{ color: s.color }}>{s.value}</span>
                    </div>
                ))}
            </div>

            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Today's Attendance Status</h3>
                <div className={styles.chartArea}>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressPart}
                            style={{ width: `${(data.today_stats.present / (data.total_employees || 1)) * 100}%`, backgroundColor: '#8b5cf6' }}
                            title="Present"
                        ></div>
                        <div
                            className={styles.progressPart}
                            style={{ width: `${(data.today_stats.absent / (data.total_employees || 1)) * 100}%`, backgroundColor: '#ef4444' }}
                            title="Absent"
                        ></div>
                    </div>
                    <div className={styles.legend}>
                        <div className={styles.legendItem}><span style={{ backgroundColor: '#8b5cf6' }}></span> Present ({data.today_stats.present})</div>
                        <div className={styles.legendItem}><span style={{ backgroundColor: '#ef4444' }}></span> Absent ({data.today_stats.absent})</div>
                        <div className={styles.legendItem}><span style={{ backgroundColor: '#e5e7eb' }}></span> Not Marked ({data.today_stats.not_marked})</div>
                    </div>
                </div>
            </section>
        </div>
    )
}

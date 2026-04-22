'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../admin.module.css'
import { Input, Button, FormAlert } from '@/components/ui'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mfaRequiredHint, setMfaRequiredHint] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setMfaRequiredHint(params.get('mfa') === 'required')
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.error || 'Invalid email or password')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleLogin} className={styles.loginCard}>
        <h1 className={styles.loginTitle}>KARPOL CMS</h1>
        <p className={styles.loginSubtitle}>Sign in to manage your content</p>
        {mfaRequiredHint && (
          <FormAlert variant="default" className={styles.loginError}>
            Your admin account must have MFA enabled before access is granted.
          </FormAlert>
        )}

        {error && (
          <FormAlert variant="default" className={styles.loginError}>
            {error}
          </FormAlert>
        )}

        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.loginInput}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.loginInput}
          required
        />
        <Button
          type="submit"
          className={styles.loginButton}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  )
}

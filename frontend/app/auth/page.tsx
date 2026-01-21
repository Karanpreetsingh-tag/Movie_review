'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const signUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Signup successful! You can now login.')
    }
    setLoading(false)
  }

  const signIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Logged in successfully!')
    }
    setLoading(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    alert('Logged out')
  }

  return (
    <main style={{ padding: 32, maxWidth: 400 }}>
      <h1>🔐 Login / Sign Up</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', padding: 8 }}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', padding: 8 }}
      />

      <br /><br />

      <button onClick={signUp} disabled={loading}>
        Sign Up
      </button>

      <button onClick={signIn} disabled={loading} style={{ marginLeft: 8 }}>
        Login
      </button>

      <br /><br />

      <button onClick={signOut}>Logout</button>
    </main>
  )
}

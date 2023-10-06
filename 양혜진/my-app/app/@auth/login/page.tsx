'use client'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()

  return (
    <div>
      <span onClick={() => router.back()}>Close modal</span>
      <h1>Login</h1>
    </div>
  )
}
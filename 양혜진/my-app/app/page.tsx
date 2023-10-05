import { Metadata } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
 
export const metadata: Metadata = {
  title: 'Next.js',
}
 
export default function Page() {
  const router = useRouter();

  const goDashboard = () => {
    router.push('/dashboard', undefined, { scroll: false })
  }

  return (
    <div>
      <h1>Hello, Home page!</h1>
      <Link href="/dashboard" scroll={false}>Dashboard</Link>
      <button type="button" onClick={goDashboard}>Dashboard</button>
    </div>
  )
}
import { Metadata } from 'next'
import Link from 'next/link'
 
export const metadata: Metadata = {
  title: 'Next.js',
}
 
export default function Page() {
  return (
    <div>
      <h1>Hello, Home page!</h1>
      <Link href="/dashboard" scroll={false}>Dashboard</Link>
    </div>
  )
}
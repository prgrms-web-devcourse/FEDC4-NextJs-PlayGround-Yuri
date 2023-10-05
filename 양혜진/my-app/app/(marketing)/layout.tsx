import { Links } from "@/app/components/links";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Link href="/about">about</Link>
      <Link href="/blog">blog</Link>
      {children}
    </section>
  )
}
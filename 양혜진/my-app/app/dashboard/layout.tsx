import { Links } from "@/app/components/links";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Links />
      <Link href="/dashboard#settings">Settings</Link>
      {children}
    </section>
  )
}
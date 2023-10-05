export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <title>kutta</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
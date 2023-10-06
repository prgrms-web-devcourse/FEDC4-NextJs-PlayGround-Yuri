export default function RootLayout(props: {
  children: React.ReactNode
  auth: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <title>kutta</title>
      </head>
      <body>{props.children}</body>
    </html>
  )
}
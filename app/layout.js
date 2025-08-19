export const metadata = {
  title: 'Reddit Search App',
  description: 'Search for subreddits using the Reddit API',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

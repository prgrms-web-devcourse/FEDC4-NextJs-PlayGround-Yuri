import Link from 'next/link'
import { Suspense } from 'react'

export type Post = {
  id: string
  title: string
  slug: string
}
 
export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul>
      <Suspense fallback={<p>Loading Feed...</p>}>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}  
      </Suspense>
    </ul>
  )
}

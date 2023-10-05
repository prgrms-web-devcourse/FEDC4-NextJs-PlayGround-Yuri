import PostList, { Post } from "@/app/(marketing)/blog/PostList";

const posts: Post[] = [
  {
    id: '1',
    title: 'post01',
    slug: 'post01-slug'
  },
  {
    id: '2',
    title: 'post02',
    slug: 'post02-slug'
  },
  {
    id: '3',
    title: 'post03',
    slug: 'post03-slug'
  }
]

export default function Page() {
  return (
    <div>
      <h1>Hello, Blog Page!</h1>
      <PostList posts={posts} />
    </div>
  )
}
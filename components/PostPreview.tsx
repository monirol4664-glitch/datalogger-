import Link from 'next/link';
import type { PostMeta } from '../lib/posts';

export default function PostPreview({ post }: { post: PostMeta }) {
  return (
    <article className="p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-1">
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="text-sm text-slate-500 mb-3">{post.date} · {post.tags?.join(', ')}</p>
      <p className="text-slate-700">{post.description}</p>
      <div className="mt-3">
        <Link href={`/posts/${post.slug}`} className="text-sm text-indigo-600">Read →</Link>
      </div>
    </article>
  );
}

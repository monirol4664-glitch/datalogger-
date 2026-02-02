import Link from 'next/link';
import { GetStaticProps } from 'next';
import { getAllPosts, generateRssAndSitemap, type PostMeta } from '../lib/posts';
import Layout from '../components/Layout';
import PostPreview from '../components/PostPreview';

type Props = {
  posts: PostMeta[];
};

export default function Home({ posts }: Props) {
  return (
    <Layout>
      <div className="container">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold">My Next.js MDX Blog</h1>
          <p className="text-slate-600 mt-2">A minimal blog scaffold — MDX, RSS, sitemap, Vercel-ready.</p>
        </header>

        <main>
          <section className="space-y-6">
            {posts.map((p) => (
              <PostPreview key={p.slug} post={p} />
            ))}
          </section>

          <div className="mt-12 text-center text-sm text-slate-500">
            <Link href="/rss.xml">RSS</Link> · <Link href="/sitemap.xml">Sitemap</Link>
          </div>
        </main>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts();
  // generate public/rss.xml and public/sitemap.xml at build time
  await generateRssAndSitemap(posts);

  return {
    props: { posts },
  };
};

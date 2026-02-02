import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote/dist/types';
import { getPostBySlug, getAllPosts, type Post } from '../../lib/posts';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';

type Props = {
  source: MDXRemoteSerializeResult;
  meta: Post['meta'];
};

export default function PostPage({ source, meta }: Props) {
  return (
    <Layout>
      <SEO title={meta.title} description={meta.description} />
      <article className="container">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">{meta.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{meta.date}</p>
        </header>

        <section className="prose">
          <MDXRemote {...(source as any)} />
        </section>
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug);
  const post = await getPostBySlug(slug);

  return {
    props: {
      source: post.source,
      meta: post.meta,
    },
  };
};

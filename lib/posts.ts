import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
const writeFile = promisify(fs.writeFile);

export type PostMeta = {
  title: string;
  description: string;
  date: string; // ISO date string
  tags?: string[];
  slug: string;
};

export type Post = {
  meta: PostMeta;
  source: any; // MDXRemoteSerializeResult
};

const POSTS_PATH = path.join(process.cwd(), 'posts');
const PUBLIC_PATH = path.join(process.cwd(), 'public');

function getPostFilePaths() {
  if (!fs.existsSync(POSTS_PATH)) return [];
  return fs.readdirSync(POSTS_PATH).filter((f) => f.endsWith('.mdx'));
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = getPostFilePaths();
  const posts: PostMeta[] = files.map((file) => {
    const slug = file.replace(/\.mdx?$/, '');
    const raw = fs.readFileSync(path.join(POSTS_PATH, file), 'utf-8');
    const { data } = matter(raw);
    return {
      title: String(data.title || slug),
      description: String(data.description || ''),
      date: new Date(String(data.date || Date.now())).toISOString().split('T')[0],
      tags: (data.tags as string[]) || [],
      slug,
    } as PostMeta;
  });

  posts.sort((a, b) => (a.date > b.date ? -1 : 1));
  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const full = path.join(POSTS_PATH, `${slug}.mdx`);
  const raw = fs.readFileSync(full, 'utf-8');
  const { data, content } = matter(raw);

  const source = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [],
    },
    scope: data,
  });

  const meta: PostMeta = {
    title: String(data.title || slug),
    description: String(data.description || ''),
    date: new Date(String(data.date || Date.now())).toISOString().split('T')[0],
    tags: (data.tags as string[]) || [],
    slug,
  };

  return { meta, source };
}

export async function generateRssAndSitemap(posts?: PostMeta[]) {
  const all = posts ?? (await getAllPosts());

  // RSS (simple)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.com';
  const rssItems = all
    .map((p) => {
      const url = `${siteUrl}/posts/${p.slug}`;
      return `  <item>
    <title>${escapeHtml(p.title)}</title>
    <link>${url}</link>
    <guid>${url}</guid>
    <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    <description>${escapeHtml(p.description || '')}</description>
  </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>My Next.js MDX Blog</title>
    <link>${siteUrl}</link>
    <description>Posts</description>
${rssItems}
  </channel>
</rss>`;

  // Sitemap
  const urls = all
    .map((p) => {
      const url = `${siteUrl}/posts/${p.slug}`;
      return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date(p.date).toISOString()}</lastmod>
  </url>`;
    })
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>daily</changefreq>
  </url>
${urls}
</urlset>`;

  // Ensure public exists
  if (!fs.existsSync(PUBLIC_PATH)) fs.mkdirSync(PUBLIC_PATH, { recursive: true });
  await writeFile(path.join(PUBLIC_PATH, 'rss.xml'), rss, 'utf-8');
  await writeFile(path.join(PUBLIC_PATH, 'sitemap.xml'), sitemap, 'utf-8');
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Named exports are already provided above (avoid anonymous default export).

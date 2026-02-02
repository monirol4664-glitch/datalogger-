import Head from 'next/head';

export default function SEO({ title, description }: { title?: string; description?: string }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.com';
  const t = title ? `${title} — Next MDX Blog` : 'Next MDX Blog';
  return (
    <Head>
      <title>{t}</title>
      {description && <meta name="description" content={description} />}
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta property="og:title" content={t} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={site} />
      <link rel="icon" href="/favicon.svg" />
    </Head>
  );
}

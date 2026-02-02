import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="container flex items-center justify-between py-6">
        <Link href="/" className="text-lg font-semibold">
          Next MDX Blog
        </Link>
        <nav className="text-sm text-slate-600 space-x-4">
          <Link href="/">Home</Link>
          <a href="/rss.xml">RSS</a>
        </nav>
      </div>
    </header>
  );
}

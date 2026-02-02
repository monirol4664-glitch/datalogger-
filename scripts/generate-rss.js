// convenience script: generate RSS + sitemap (used by npm run generate:rss)
const { generateRssAndSitemap } = require('../lib/posts');

async function run() {
  try {
    await generateRssAndSitemap();
    console.log('RSS and sitemap generated in public/');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

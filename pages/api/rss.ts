import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const file = path.join(process.cwd(), 'public', 'rss.xml');
  if (!fs.existsSync(file)) {
    return res.status(404).send('RSS not found');
  }
  const xml = fs.readFileSync(file, 'utf-8');
  res.setHeader('Content-Type', 'application/rss+xml');
  res.status(200).send(xml);
}

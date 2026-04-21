// scripts/check-doclink-paths.js
// Resolves doclink `path` values to files under content/<lang>/docs/ and reports missing pages.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.resolve(__dirname, '../content');

function getLanguageFromFile(filePath) {
  const n = filePath.replaceAll('\\', '/');
  const m = n.match(/^.*\/content\/([^/]+)\/docs\//);
  return m ? m[1] : null;
}

function isExternalPath(p) {
  const t = p.trim();
  return /^https?:\/\//i.test(t) || t.startsWith('//');
}

/**
 * @returns {{ ok: boolean, target?: string, external?: boolean }}
 */
function resolveDoclinkPathToFile(docPath, lang) {
  const withoutHash = docPath.split('#')[0].trim();
  if (isExternalPath(withoutHash)) {
    return { ok: true, external: true };
  }

  let rel = withoutHash.replace(/^\/+/, '');
  if (rel.includes('..')) {
    return { ok: false, target: null };
  }
  rel = rel.replace(/\/+$/, '');

  const docsRoot = path.join(contentDir, lang, 'docs');

  if (rel === '') {
    return { ok: false, target: null };
  }

  if (rel.endsWith('.md')) {
    const full = path.join(docsRoot, rel);
    return { ok: fs.existsSync(full), target: full };
  }

  const asLeaf = path.join(docsRoot, `${rel}.md`);
  if (fs.existsSync(asLeaf)) {
    return { ok: true, target: asLeaf };
  }

  const asBundle = path.join(docsRoot, rel, '_index.md');
  if (fs.existsSync(asBundle)) {
    return { ok: true, target: asBundle };
  }

  const segs = rel.split('/').filter(Boolean);
  if (segs.length === 0) {
    return { ok: false, target: asLeaf };
  }
  const last = segs[segs.length - 1];
  const parentDir = path.join(docsRoot, ...segs.slice(0, -1));
  if (!fs.existsSync(parentDir) || !fs.statSync(parentDir).isDirectory()) {
    return { ok: false, target: asLeaf };
  }
  const entries = fs.readdirSync(parentDir);
  const wantFile = `${last}.md`.toLowerCase();
  const found = entries.find((e) => e.toLowerCase() === wantFile);
  if (found) {
    return { ok: true, target: path.join(parentDir, found) };
  }
  const foundDir = entries.find((e) => {
    const p = path.join(parentDir, e);
    return (
      e.toLowerCase() === last.toLowerCase() && fs.existsSync(p) && fs.statSync(p).isDirectory()
    );
  });
  if (foundDir) {
    const idx = path.join(parentDir, foundDir, '_index.md');
    if (fs.existsSync(idx)) {
      return { ok: true, target: idx };
    }
  }
  return { ok: false, target: asLeaf };
}

/**
 * @returns {string[]}
 */
function extractDoclinkPaths(content) {
  const paths = new Set();
  // Primary: full shortcode on one line
  const re1 = /{{< doclink[^>]*\spath="([^"]+)"/g;
  let m;
  while ((m = re1.exec(content)) !== null) {
    paths.add(m[1]);
  }
  // Single-quoted (if ever used)
  const re2 = /{{< doclink[^>]*\spath='([^']+)'/g;
  while ((m = re2.exec(content)) !== null) {
    paths.add(m[1]);
  }
  return [...paths];
}

async function main() {
  const pattern = path.join(contentDir, '**/docs/**/*.md');
  const files = await glob(pattern);
  const errors = [];

  for (const file of files) {
    const lang = getLanguageFromFile(file);
    if (lang === null) {
      continue;
    }
    const content = fs.readFileSync(file, 'utf8');
    const docPaths = extractDoclinkPaths(content);
    for (const p of docPaths) {
      const r = resolveDoclinkPathToFile(p, lang);
      if (r.ok && !r.external) {
        continue;
      }
      if (r.ok && r.external) {
        continue;
      }
      if (!r.ok) {
        errors.push({
          file: path.relative(contentDir, file),
          path: p,
        });
      }
    }
  }

  if (errors.length > 0) {
    console.error('❌ Doclink path check failed: some paths do not match a page under content/<lang>/docs/');
    console.error('');
    for (const e of errors) {
      console.error(`  ${e.file}`);
      console.error(`    path="${e.path}"`);
    }
    console.error('');
    process.exit(1);
  }

  console.log('✅ All doclink paths resolve to existing documentation files');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

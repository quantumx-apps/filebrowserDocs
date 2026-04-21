// scripts/check-doclink-paths.js
// Resolves doclink `path` values to files under content/<lang>/docs/ and reports missing pages.
// Matching is case-insensitive for every path segment so URL-style paths (integrations/office/...)
// match the repo layout on case-sensitive filesystems (Linux) even when directory casing differs
// (e.g. Other vs other, Migration vs migration, Frontend vs frontend where applicable).
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

function normalizeDoclinkRel(p) {
  let rel = p.split('#')[0].trim();
  if (isExternalPath(rel)) {
    return { external: true, rel: '' };
  }
  rel = rel.replace(/^\/+/, '');
  // Some pages mistakenly use an absolute site path: /en/docs/.../ or /integrations/...
  const langDocs = rel.match(/^(?:[a-z]{2}(?:-[a-z]+)?\/)?docs\/(.+)$/i);
  if (langDocs) {
    rel = langDocs[1];
  }
  if (rel.includes('..')) {
    return { bad: true, rel: '' };
  }
  rel = rel.replace(/\/+$/, '');
  return { external: false, rel };
}

/**
 * @param {string} dir
 * @param {string} name directory name (one segment, no slashes)
 * @returns {string | null} actual entry name
 */
function findDirCaseInsensitive(dir, name) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return null;
  }
  const want = name.toLowerCase();
  for (const e of fs.readdirSync(dir)) {
    if (e.toLowerCase() !== want) {
      continue;
    }
    const p = path.join(dir, e);
    if (fs.statSync(p).isDirectory()) {
      return e;
    }
  }
  return null;
}

/**
 * Resolve a docs URL path (no leading slash, no .md) to a concrete markdown file.
 * @param {string} docsRoot
 * @param {string} rel e.g. configuration/frontend/styling
 * @returns {string | null}
 */
function resolveUrlPathToContentFile(docsRoot, rel) {
  const parts = rel.split('/').filter(Boolean);
  if (parts.length === 0) {
    return null;
  }
  let current = docsRoot;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const d = findDirCaseInsensitive(current, parts[i]);
    if (d === null) {
      return null;
    }
    current = path.join(current, d);
  }
  const last = parts[parts.length - 1];
  const wantLast = last.toLowerCase();
  if (!fs.existsSync(current) || !fs.statSync(current).isDirectory()) {
    return null;
  }
  const entries = fs.readdirSync(current);
  for (const e of entries) {
    if (e.toLowerCase() === `${wantLast}.md` && fs.statSync(path.join(current, e)).isFile()) {
      return path.join(current, e);
    }
  }
  for (const e of entries) {
    if (e.toLowerCase() === wantLast) {
      const p = path.join(current, e);
      if (fs.statSync(p).isDirectory()) {
        const idx = path.join(p, '_index.md');
        if (fs.existsSync(idx)) {
          return idx;
        }
      }
    }
  }
  return null;
}

/**
 * @param {string} docsRoot
 * @param {string} rel path ending in .md
 * @returns {string | null}
 */
function resolveExplicitMdPath(docsRoot, rel) {
  const parts = rel.split('/').filter(Boolean);
  if (parts.length === 0) {
    return null;
  }
  let current = docsRoot;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const d = findDirCaseInsensitive(current, parts[i]);
    if (d === null) {
      return null;
    }
    current = path.join(current, d);
  }
  const fileName = parts[parts.length - 1];
  if (!fileName.toLowerCase().endsWith('.md')) {
    return null;
  }
  if (!fs.existsSync(current) || !fs.statSync(current).isDirectory()) {
    return null;
  }
  const want = fileName.toLowerCase();
  for (const e of fs.readdirSync(current)) {
    if (e.toLowerCase() === want && fs.statSync(path.join(current, e)).isFile()) {
      return path.join(current, e);
    }
  }
  return null;
}

/**
 * @returns {{ ok: boolean, target?: string | null, external?: boolean }}
 */
function resolveDoclinkPathToFile(docPath, lang) {
  const norm = normalizeDoclinkRel(docPath);
  if (norm.external) {
    return { ok: true, external: true };
  }
  if (norm.bad) {
    return { ok: false, target: null };
  }
  const { rel } = norm;
  if (rel === '') {
    return { ok: false, target: null };
  }

  const docsRoot = path.join(contentDir, lang, 'docs');

  if (rel.endsWith('.md')) {
    const resolved = resolveExplicitMdPath(docsRoot, rel);
    return { ok: resolved !== null, target: resolved };
  }

  const resolved = resolveUrlPathToContentFile(docsRoot, rel);
  return { ok: resolved !== null, target: resolved };
}

/**
 * @returns {string[]}
 */
function extractDoclinkPaths(content) {
  const paths = new Set();
  const re1 = /{{< doclink[^>]*\spath="([^"]+)"/g;
  let m;
  while ((m = re1.exec(content)) !== null) {
    paths.add(m[1]);
  }
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
    const fileContent = fs.readFileSync(file, 'utf8');
    const docPaths = extractDoclinkPaths(fileContent);
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

// converts the issue/pr numbers that are surrounded by parenthesis like (#1234) to GH issue/pr links and adds a pr/issue text.
// it works without a GH token too, but the token is only needed if you got rate-limited.
// basically does all of this (for example):
//
// (#1234) -> ([issue #1234](https://github.com/owner/repo/issues/1234)) -- or pr if the link is a pull
// @user -> [@user](https://github.com/user)
// v2.0.5-beta -> [v2.0.5-beta](https://github.com/gtsteffaniak/filebrowser/releases/tag/v2.0.5-beta)
// https://github.com/gtsteffaniak/filebrowser/compare/v1.3.4-beta...v1.3.5-beta -> [v1.3.4-beta...v1.3.5-beta](https://github.com/gtsteffaniak/filebrowser/compare/v1.3.4-beta...v1.3.5-beta)

import fs from 'fs-extra';

const FILES = [
  'content/en/docs/changelog/stable.md',
  'content/en/docs/changelog/beta.md',
];

const args = process.argv.slice(2);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_OWNER = 'gtsteffaniak';
const REPO_NAME = 'filebrowser';
const checkOnly = args.includes('--check') || args.includes('-c');
const RELEASE_TAG = /(\[[^\]]*\]\([^)]*\)|https?:\/\/\S+)|\b(v\d+\.\d+\.\d+-(?:stable|beta))\b/g;
const PATTERN = /(?<!\])\(#(\d+)\)/g;
const MENTIONS = /(?<![\w[/])@([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})?)/g;
// to compare diff urls in the 'full changelog' part
const COMPARE_URL_PATTERN = new RegExp(`(?<!\\]\\()https://github\\.com/${REPO_OWNER}/${REPO_NAME}/compare/([^\\s]+)`,'g');

// to skip hugo shortcodes sorrounded by `{{ }}` (just in case)
// and code blocks and content with backticks
function isSkippable(content) {
  return content.split(/(\{\{<[\s\S]*?>\}\}|```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]+`|\[[^\]]*\]\([^)]*\))/g);
}
function isShortcode(index) {
  return index % 2 === 1;
}

// Compare tht refs/tags never end in punctuation and trim anything trailing
function convertCompareLinks(content) {
  return content.replace(COMPARE_URL_PATTERN, (fullMatch, ref) => {
    const trailing = ref.match(/[.,;:!?)\]]+$/)?.[0] ?? '';
    const cleanRef = trailing ? ref.slice(0, -trailing.length) : ref;
    const cleanUrl = trailing ? fullMatch.slice(0, -trailing.length) : fullMatch;
    return `[${cleanRef}](${cleanUrl})${trailing}`;
  });
}

function convertReleaseTags(content) {
  return content.replace(RELEASE_TAG, (fullMatch, protectedMatch, tag) => {
    if (protectedMatch) return protectedMatch;
    return `[${tag}](https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/tag/${tag})`;
  });
}

function convertMentions(content) {
  return content.replace(MENTIONS, (fullMatch, username) => {
    return `[@${username}](https://github.com/${username})`;
  });
}

function extractNumbers(content) {
  return [...new Set([...content.matchAll(PATTERN)].map((m) => m[1]))];
}

function needsChanges(content) {
  const parts = isSkippable(content);
  return parts.some((part, i) => {
    if (isShortcode(i)) return false;
    return (
      extractNumbers(part).length > 0 ||
      convertCompareLinks(part) !== part ||
      convertReleaseTags(part) !== part ||
      convertMentions(part) !== part
    );
  });
}

// returns null
async function resolveType(number) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${number}`;
  const headers = { Accept: 'application/vnd.github+json' };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

  try {
    const res = await fetch(url, { headers });
    if (res.status === 403 || res.status === 429) {
      console.warn(`⚠️ Seems like you got rate limited - leaving #${number} unlinked`);
      return null;
    }
    if (!res.ok) return null;
    const data = await res.json();
    return data.pull_request ? 'pull' : 'issues';
  } catch (error) {
    console.warn(`⚠️ Error resolving #${number}: ${error.message}`);
    return null;
  }
}

async function convert(content) {
  const parts = isSkippable(content);
  const textParts = parts.filter((_, i) => !isShortcode(i));
  const numbers = new Set(textParts.flatMap(extractNumbers));
  const types = {};
  for (const num of numbers) {
    types[num] = await resolveType(num);
  }
  return parts
    .map((part, i) => {
      if (isShortcode(i)) return part;
      let converted = convertCompareLinks(part);
      converted = convertReleaseTags(converted);
      converted = convertMentions(converted);
      return converted.replace(PATTERN, (fullMatch, num) => {
        const type = types[num];
        if (!type) return fullMatch; // don't do anything if couldn't resolve
        const label = type === 'pull' ? 'pr' : 'issue';
        return `([${label} #${num}](https://github.com/${REPO_OWNER}/${REPO_NAME}/${type}/${num}))`;
      });
    }).join('');
}

async function processFile(filePath) {
  if (!(await fs.pathExists(filePath))) {
    console.log(`⚠️ File not found: ${filePath}`);
    return false;
  }
  const original = await fs.readFile(filePath, 'utf8');

  if (checkOnly) {
    if (!needsChanges(original)) {
      console.log(`☑️ ${filePath} - no changes needed!`);
      return false;
    }
    console.log(`⚠️ ${filePath} - needs some changes`);
    return true;
  }

  const updated = await convert(original);
  if (updated === original) {
    console.log(`✅ ${filePath} - no changes needed!`);
    return false;
  }
  await fs.writeFile(filePath, updated, 'utf8');
  console.log(`✅ ${filePath} - updated`);
  return true;
}

async function main() {
  if (!GITHUB_TOKEN && !checkOnly) { console.log('ℹ️ No GITHUB_TOKEN set, you can be rate-limited by GH'); }
  if (checkOnly) { console.log('No files will be modified\n'); }
  console.log('Processing changelog files...\n');

  let anyChanges = false;
  for (const file of FILES) {
    const changed = await processFile(file);
    anyChanges = anyChanges || changed;
  }
  console.log(checkOnly ? '✅ Check completed' : '✅ Changelogs updated');
  if (checkOnly && anyChanges) process.exitCode = 1;
  return anyChanges;
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

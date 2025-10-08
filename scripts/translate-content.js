// scripts/translate-content.js
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as glob from 'glob';
import * as deepl from 'deepl-node';

// Parse command line arguments
const args = process.argv.slice(2);
const checkOnly = args.includes('--check') || args.includes('-c');
const targetLang = args.find(arg => arg.startsWith('--lang='))?.split('=')[1];

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.resolve(__dirname, '../content');
const masterContentDir = path.join(contentDir, 'docs');
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

if (!checkOnly && !DEEPL_API_KEY) {
  console.error("❌ Missing DEEPL_API_KEY in environment.");
  process.exit(1);
}

const translator = checkOnly ? null : new deepl.Translator(DEEPL_API_KEY);

// Language configuration from hugo.toml
const languages = {
  'ar': { name: 'Arabic', deepl: 'AR' },
  'cs': { name: 'Czech', deepl: 'CS' },
  'de': { name: 'German', deepl: 'DE' },
  'el': { name: 'Greek', deepl: 'EL' },
  'es': { name: 'Spanish', deepl: 'ES' },
  'fr': { name: 'French', deepl: 'FR' },
  'he': { name: 'Hebrew', deepl: 'HE' },
  'hu': { name: 'Hungarian', deepl: 'HU' },
  'is': { name: 'Icelandic', deepl: 'IS' },
  'it': { name: 'Italian', deepl: 'IT' },
  'ja': { name: 'Japanese', deepl: 'JA' },
  'ko': { name: 'Korean', deepl: 'KO' },
  'nl-be': { name: 'Dutch (Belgium)', deepl: 'NL' },
  'pl': { name: 'Polish', deepl: 'PL' },
  'pt': { name: 'Portuguese', deepl: 'PT-PT' },
  'pt-br': { name: 'Portuguese (Brazil)', deepl: 'PT-BR' },
  'ro': { name: 'Romanian', deepl: 'RO' },
  'ru': { name: 'Russian', deepl: 'RU' },
  'sk': { name: 'Slovak', deepl: 'SK' },
  'sv-se': { name: 'Swedish (Sweden)', deepl: 'SV' },
  'tr': { name: 'Turkish', deepl: 'TR' },
  'uk': { name: 'Ukrainian', deepl: 'UK' },
  'zh-cn': { name: 'Chinese (Simplified)', deepl: 'ZH-HANS' },
  'zh-tw': { name: 'Chinese (Traditional)', deepl: 'ZH-HANT' }
};

// --- Translation Function ---
async function translateText(text, targetLanguage) {
  if (checkOnly) {
    return text;
  }

  if (!text || typeof text !== 'string' || text.trim() === '') {
    return text;
  }

  // Skip translation for certain patterns
  if (text.match(/^#+\s*$/) || // Empty headers
      text.match(/^```/) || // Code blocks
      text.match(/^\|/) || // Tables
      text.match(/^```[\s\S]*?```$/m)) { // Code blocks
    return text;
  }

  try {
    const deeplLang = languages[targetLanguage]?.deepl || targetLanguage.toUpperCase();
    const result = await translator.translateText(text, 'en', deeplLang);
    
    // Delay to avoid rate-limiting
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return result.text;
  } catch (err) {
    console.error(`⚠️ Translation failed for "${text.substring(0, 50)}...":`, err?.message || err);
    return text; // Return original text if translation fails
  }
}

// --- Process Markdown File ---
async function processMarkdownFile(filePath, targetLang) {
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split('\n');
  const translatedLines = [];
  
  let inCodeBlock = false;
  let inFrontMatter = false;
  let frontMatterEnded = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Handle front matter
    if (line === '---' && !frontMatterEnded) {
      if (inFrontMatter) {
        inFrontMatter = false;
        frontMatterEnded = true;
      } else {
        inFrontMatter = true;
      }
      translatedLines.push(line);
      continue;
    }
    
    // Skip front matter content
    if (inFrontMatter) {
      translatedLines.push(line);
      continue;
    }
    
    // Handle code blocks
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      translatedLines.push(line);
      continue;
    }
    
    // Skip code blocks
    if (inCodeBlock) {
      translatedLines.push(line);
      continue;
    }
    
    // Skip empty lines, headers without content, and special markdown
    if (line.trim() === '' || 
        line.match(/^#+\s*$/) ||
        line.match(/^\|/) ||
        line.match(/^```/) ||
        line.match(/^---/) ||
        line.match(/^<!--/) ||
        line.match(/^\[/) && line.match(/\]\(/)) {
      translatedLines.push(line);
      continue;
    }
    
    // Translate the line
    const translatedLine = await translateText(line, targetLang);
    translatedLines.push(translatedLine);
  }
  
  return translatedLines.join('\n');
}

// --- Create Directory Structure ---
async function createLanguageDirectories() {
  for (const [langCode, langInfo] of Object.entries(languages)) {
    const langDir = path.join(contentDir, langCode, 'docs');
    await fs.ensureDir(langDir);
    console.log(`Created directory: ${langDir}`);
  }
}

// --- Get All Markdown Files ---
async function getAllMarkdownFiles() {
  const pattern = path.join(masterContentDir, '**/*.md');
  return glob.sync(pattern);
}

// --- Copy Directory Structure ---
async function copyDirectoryStructure(sourceDir, targetDir) {
  const items = await fs.readdir(sourceDir, { withFileTypes: true });
  
  for (const item of items) {
    const sourcePath = path.join(sourceDir, item.name);
    const targetPath = path.join(targetDir, item.name);
    
    if (item.isDirectory()) {
      await fs.ensureDir(targetPath);
      await copyDirectoryStructure(sourcePath, targetPath);
    }
  }
}

// --- Main Translation Function ---
async function translateContent() {
  if (checkOnly) {
    console.log("--- Checking for content translation needs (no translations will be performed) ---");
  } else {
    console.log("--- Translating content files ---");
  }

  // Create language directories
  await createLanguageDirectories();

  // Get all markdown files
  const markdownFiles = await getAllMarkdownFiles();
  console.log(`Found ${markdownFiles.length} markdown files to process`);

  const languagesToProcess = targetLang ? [targetLang] : Object.keys(languages);
  
  for (const langCode of languagesToProcess) {
    if (!languages[langCode]) {
      console.warn(`Unknown language: ${langCode}`);
      continue;
    }

    console.log(`\n--- Processing language: ${languages[langCode].name} (${langCode}) ---`);
    const langDir = path.join(contentDir, langCode, 'docs');
    
    // Copy directory structure first
    await copyDirectoryStructure(masterContentDir, langDir);
    
    let translatedCount = 0;
    let skippedCount = 0;
    
    for (const filePath of markdownFiles) {
      const relativePath = path.relative(masterContentDir, filePath);
      const targetPath = path.join(langDir, relativePath);
      
      try {
        if (checkOnly) {
          console.log(`Would translate: ${relativePath}`);
          translatedCount++;
        } else {
          const translatedContent = await processMarkdownFile(filePath, langCode);
          await fs.writeFile(targetPath, translatedContent, 'utf8');
          console.log(`Translated: ${relativePath}`);
          translatedCount++;
        }
      } catch (error) {
        console.error(`Error processing ${relativePath}:`, error.message);
        skippedCount++;
      }
    }
    
    console.log(`Language ${langCode}: ${translatedCount} files processed, ${skippedCount} skipped`);
  }

  if (checkOnly) {
    console.log('\n✅ Content translation check complete.');
  } else {
    console.log('\n✅ Content translation complete.');
  }
}

// --- CLI Usage ---
if (targetLang && !languages[targetLang]) {
  console.error(`❌ Unknown language: ${targetLang}`);
  console.error(`Available languages: ${Object.keys(languages).join(', ')}`);
  process.exit(1);
}

translateContent()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error("\n❌ An error occurred during content translation:", error);
    process.exit(1);
  });
